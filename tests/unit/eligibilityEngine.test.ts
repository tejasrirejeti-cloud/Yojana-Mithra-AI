import { describe, it, expect } from 'vitest';

interface CitizenProfile {
  state: string;
  district: string;
  category: string;
  incomeBand: string;
  gender: string;
  age: number;
}

interface Scheme {
  id: string;
  title: string;
  targetCategory: string;
  maxIncomeBand: string;
  gender: string;
  minAge: number;
  maxAge: number;
}

function calculateEligibilityScore(profile: CitizenProfile, scheme: Scheme): { score: number; eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // Category Match
  if (scheme.targetCategory === 'All' || scheme.targetCategory === profile.category) {
    score += 40;
    reasons.push('Category criteria matched');
  } else {
    reasons.push('Category mismatch');
  }

  // Income Match
  const incomeLevels: Record<string, number> = {
    'Below ₹1 Lakh': 1,
    '₹1 Lakh - ₹3 Lakhs': 2,
    '₹3 Lakhs - ₹6 Lakhs': 3,
    'Above ₹6 Lakhs': 4
  };
  const userIncomeLevel = incomeLevels[profile.incomeBand] || 4;
  const maxIncomeLevel = incomeLevels[scheme.maxIncomeBand] || 4;

  if (userIncomeLevel <= maxIncomeLevel) {
    score += 30;
    reasons.push('Income bracket within limit');
  } else {
    reasons.push('Income exceeds scheme ceiling');
  }

  // Age Match
  if (profile.age >= scheme.minAge && profile.age <= scheme.maxAge) {
    score += 20;
    reasons.push('Age criteria satisfied');
  } else {
    reasons.push('Age outside scheme range');
  }

  // Gender Match
  if (scheme.gender === 'All' || scheme.gender === profile.gender) {
    score += 10;
    reasons.push('Gender requirement met');
  }

  const eligible = score >= 70;
  return { score, eligible, reasons };
}

describe('Citizen Scheme Eligibility Engine', () => {
  const mockScheme: Scheme = {
    id: 'TS-RYTHU-BANDHU',
    title: 'Rythu Bandhu Scheme',
    targetCategory: 'Farmer',
    maxIncomeBand: '₹3 Lakhs - ₹6 Lakhs',
    gender: 'All',
    minAge: 18,
    maxAge: 75
  };

  it('should mark high-matching eligible farmer profile as eligible', () => {
    const profile: CitizenProfile = {
      state: 'Telangana',
      district: 'Hyderabad',
      category: 'Farmer',
      incomeBand: 'Below ₹1 Lakh',
      gender: 'Male',
      age: 35
    };

    const result = calculateEligibilityScore(profile, mockScheme);
    expect(result.eligible).toBe(true);
    expect(result.score).toBe(100);
    expect(result.reasons).toContain('Category criteria matched');
  });

  it('should reject profile exceeding income criteria', () => {
    const profile: CitizenProfile = {
      state: 'Telangana',
      district: 'Hyderabad',
      category: 'Student',
      incomeBand: 'Above ₹6 Lakhs',
      gender: 'Female',
      age: 15
    };

    const result = calculateEligibilityScore(profile, mockScheme);
    expect(result.eligible).toBe(false);
    expect(result.score).toBeLessThan(70);
    expect(result.reasons).toContain('Income exceeds scheme ceiling');
  });
});
