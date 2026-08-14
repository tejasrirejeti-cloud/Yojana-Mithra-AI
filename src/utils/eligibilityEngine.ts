import { CitizenProfile, GovernmentScheme, EligibilityResult } from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';

export function evaluateSchemeEligibility(profile: CitizenProfile, scheme: GovernmentScheme): EligibilityResult {
  const matchedCriteria: string[] = [];
  const missingCriteria: string[] = [];
  let score = 100;

  const crit = scheme.eligibilityCriteria;

  // Helper occupation normalization
  const occLower = (profile.occupation || '').toLowerCase();
  
  // Normalized student detection
  const isStudentProfile = 
    Boolean(profile.isStudent) ||
    occLower.includes('student') ||
    occLower.includes('pupil') ||
    occLower.includes('scholar') ||
    occLower.includes('study') ||
    occLower.includes('studying') ||
    occLower.includes('college') ||
    occLower.includes('school') ||
    occLower.includes('learner');

  // Excluded professions for farmer direct cash transfers (PM-KISAN, Rythu Bandhu, etc.)
  const isExcludedGovtOrProfessional = 
    occLower.includes('retired') ||
    occLower.includes('officer') ||
    occLower.includes('government') ||
    occLower.includes('govt') ||
    occLower.includes('pensioner') ||
    occLower.includes('salaried') ||
    occLower.includes('taxpayer') ||
    occLower.includes('doctor') ||
    occLower.includes('engineer') ||
    occLower.includes('lawyer') ||
    occLower.includes('ca') ||
    occLower.includes('architect') ||
    occLower.includes('corporate') ||
    occLower.includes('banker') ||
    isStudentProfile;

  const isFarmerOccupation = 
    occLower.includes('farmer') || 
    occLower.includes('agri') || 
    occLower.includes('cultivat') ||
    occLower.includes('rythu') ||
    occLower.includes('kisan');

  // Derive true effective farmer status
  const effectiveIsFarmer = (isFarmerOccupation || (Boolean(profile.isFarmer) && !isExcludedGovtOrProfessional)) && !isStudentProfile;

  // 1. Farmer / Agricultural Requirement (Hard Filter)
  if (crit.isFarmerOnly || scheme.category === 'Agriculture') {
    if (isExcludedGovtOrProfessional && !isFarmerOccupation) {
      missingCriteria.push(`PM-KISAN & Farmer welfare benefits strictly exclude Serving/Retired Government Officers, Employees, Pensioners (>₹10,000/mo), Income Tax Payers, and Students (${profile.occupation || 'Non-Farmer'}).`);
      score = 0; // Immediate hard disqualification to 0%
    } else if (!effectiveIsFarmer) {
      missingCriteria.push(`Exclusively for active Farmers / Agriculture (Current occupation: ${profile.occupation || 'Non-Farmer'}).`);
      score = 0; // Immediate hard disqualification for non-farmers
    } else {
      matchedCriteria.push('Occupational status confirmed as Active Farmer / Agriculture.');
    }
  }

  // 2. Gender Requirement Check (Hard Filter)
  if (crit.genderFilter && crit.genderFilter !== 'All') {
    if (profile.gender) {
      if (profile.gender.toLowerCase() === crit.genderFilter.toLowerCase()) {
        matchedCriteria.push(`Gender (${profile.gender}) matches target demographic (${crit.genderFilter}).`);
      } else {
        missingCriteria.push(`Scheme is restricted exclusively to ${crit.genderFilter} applicants (Current profile: ${profile.gender}).`);
        score -= 90; // Hard penalty for gender mismatch
      }
    } else {
      missingCriteria.push(`Gender verification needed (Scheme is for ${crit.genderFilter}).`);
      score -= 25;
    }
  }

  // 3. State Domicile Requirement Check (Hard Filter)
  if (scheme.targetStates && scheme.targetStates.length > 0) {
    if (profile.state) {
      const stateMatch = scheme.targetStates.some(s => s.toLowerCase() === profile.state?.toLowerCase());
      if (stateMatch) {
        matchedCriteria.push(`Resident of target state (${profile.state}).`);
      } else {
        missingCriteria.push(`State-specific scheme for ${scheme.targetStates.join(', ')} (Current state: ${profile.state}).`);
        score -= 90; // Hard penalty for state mismatch
      }
    } else {
      missingCriteria.push(`State of domicile required to confirm eligibility (${scheme.targetStates.join(', ')}).`);
      score -= 25;
    }
  }

  // 4. Student Requirement Check & Education Category Boost
  if (crit.isStudentOnly || scheme.category === 'Education') {
    if (isStudentProfile) {
      matchedCriteria.push('Active Student status confirmed for educational scholarship / support benefits.');
    } else if (crit.isStudentOnly && profile.occupation) {
      missingCriteria.push(`Exclusively for enrolled Students (Current profile: ${profile.occupation}).`);
      score = 0; // Immediate disqualification for non-students
    } else if (crit.isStudentOnly) {
      missingCriteria.push('Student enrollment status required.');
      score -= 50;
    }
  }

  // 5. Specific Occupation Requirements (e.g. Artisans for PM Vishwakarma, Vendors for PM SVANidhi)
  if (crit.requiredOccupations && crit.requiredOccupations.length > 0) {
    if (profile.occupation) {
      const occMatch = crit.requiredOccupations.some(req => 
        occLower.includes(req.toLowerCase()) ||
        req.toLowerCase().includes(occLower)
      );
      if (occMatch) {
        matchedCriteria.push(`Occupation (${profile.occupation}) matches target category (${crit.requiredOccupations.slice(0, 3).join(', ')}).`);
      } else {
        missingCriteria.push(`Targeted specifically at trades: ${crit.requiredOccupations.slice(0, 3).join(', ')} (Incompatible with ${profile.occupation}).`);
        score = 0; // Immediate hard disqualification if occupation is incompatible
      }
    } else {
      missingCriteria.push(`Specific occupation required (${crit.requiredOccupations.slice(0, 3).join(', ')}).`);
      score -= 30;
    }
  }

  // 6. Age Check
  if (crit.minAge !== undefined || crit.maxAge !== undefined) {
    if (profile.age !== undefined) {
      const minPass = crit.minAge === undefined || profile.age >= crit.minAge;
      const maxPass = crit.maxAge === undefined || profile.age <= crit.maxAge;
      if (minPass && maxPass) {
        matchedCriteria.push(`Age (${profile.age} yrs) is within eligible range (${crit.minAge ?? 'Min'} - ${crit.maxAge ?? 'No upper limit'} yrs).`);
      } else {
        missingCriteria.push(`Age ${profile.age} yrs is outside required age window (${crit.minAge ?? 'Min'} - ${crit.maxAge ?? 'No limit'} yrs).`);
        score -= 80; // Hard penalty for age out of bounds
      }
    } else {
      missingCriteria.push(`Age verification needed (Required: ${crit.minAge ?? '18'}+ yrs).`);
      score -= 15;
    }
  }

  // 7. Income Ceiling Check
  if (crit.maxIncomeINR !== undefined) {
    if (profile.annualIncome !== undefined) {
      if (profile.annualIncome <= crit.maxIncomeINR) {
        matchedCriteria.push(`Annual income ₹${profile.annualIncome.toLocaleString('en-IN')} is within eligibility threshold ₹${crit.maxIncomeINR.toLocaleString('en-IN')}.`);
      } else {
        missingCriteria.push(`Annual income ₹${profile.annualIncome.toLocaleString('en-IN')} exceeds eligibility ceiling of ₹${crit.maxIncomeINR.toLocaleString('en-IN')}.`);
        if (profile.annualIncome > crit.maxIncomeINR * 1.5) {
          score = 0; // Disqualify if income is significantly higher
        } else {
          score -= 75;
        }
      }
    } else {
      missingCriteria.push(`Income details not provided (Max ceiling: ₹${crit.maxIncomeINR.toLocaleString('en-IN')}).`);
      score -= 20;
    }
  }

  // 8. Landholding Check
  if (crit.maxLandAcres !== undefined) {
    if (profile.landholdingAcres !== undefined) {
      if (profile.landholdingAcres <= crit.maxLandAcres) {
        matchedCriteria.push(`Landholding of ${profile.landholdingAcres} acres is within max limit of ${crit.maxLandAcres} acres.`);
      } else {
        missingCriteria.push(`Landholding of ${profile.landholdingAcres} acres exceeds upper limit of ${crit.maxLandAcres} acres.`);
        score -= 60;
      }
    }
  }

  // 9. BPL Status Check
  if (crit.isBPLOnly) {
    if (profile.isBPL) {
      matchedCriteria.push('BPL / Ration Card category verified.');
    } else if (profile.annualIncome && profile.annualIncome <= 200000) {
      matchedCriteria.push('Income falls within EWS / Low-income tier.');
    } else {
      missingCriteria.push('Requires Below Poverty Line (BPL) / EWS Food Security Ration Card.');
      score -= 75;
    }
  }

  // 10. Caste Category Check
  if (crit.allowedCastes && crit.allowedCastes.length > 0) {
    if (profile.caste) {
      if (crit.allowedCastes.map(c => c.toLowerCase()).includes(profile.caste.toLowerCase())) {
        matchedCriteria.push(`Caste category (${profile.caste}) matches target group (${crit.allowedCastes.join('/')}).`);
      } else {
        missingCriteria.push(`Specifically targets ${crit.allowedCastes.join('/')} categories (Current: ${profile.caste}).`);
        score -= 70;
      }
    }
  }

  // Clamp score between 0 and 100
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // Determine status cleanly based on calculated score
  let status: EligibilityResult['status'] = 'Ineligible';
  if (score >= 80) status = 'Highly Eligible';
  else if (score >= 60) status = 'Moderately Eligible';
  else if (score >= 35) status = 'Requires Documents';
  else status = 'Ineligible';

  // Construct clear explanation
  let explanation = '';
  if (status === 'Highly Eligible') {
    explanation = `High Match (${score}%): You meet the core requirements for ${scheme.name}: ${matchedCriteria.slice(0, 3).join(' ')}`;
  } else if (status === 'Moderately Eligible') {
    explanation = `Moderate Match (${score}%): ${matchedCriteria.join(' ')} Note: ${missingCriteria.join(' ')}`;
  } else if (status === 'Requires Documents') {
    explanation = `Potential Match (${score}%): Requires additional document proof: ${missingCriteria.join(' ')}`;
  } else {
    explanation = `Ineligible (${score}%): You do not meet core eligibility criteria for ${scheme.name}: ${missingCriteria.join(' ')}`;
  }

  const recommendedNextSteps: string[] = [
    `Gather required documents: ${scheme.requiredDocuments.slice(0, 3).join(', ')}.`,
    `Visit official portal: ${scheme.officialWebsite} or call Helpline ${scheme.helpline}.`,
    `Visit nearest MeeSeva or CSC Center for application processing.`
  ];

  return {
    schemeId: scheme.id,
    scheme,
    score,
    status,
    matchedCriteria,
    missingCriteria,
    explanation,
    recommendedNextSteps
  };
}

export function getAllEligibilityResults(profile: CitizenProfile): EligibilityResult[] {
  return SCHEMES_DATABASE.map(scheme => evaluateSchemeEligibility(profile, scheme))
    .sort((a, b) => b.score - a.score);
}
