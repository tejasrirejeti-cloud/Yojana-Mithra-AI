import { GovernmentScheme } from '../types';

export const SCHEMES_DATABASE: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    hindiName: 'प्रधानमंत्री किसान सम्मान निधि',
    teluguName: 'ప్రధానమంత్రి కిసాన్ సమ్మాన్ నిధి',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    isCentral: true,
    description: 'Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly into the bank accounts of small and marginal landholder farmer families.',
    shortDescription: '₹6,000/year financial assistance directly deposited into bank account for landholding farmers.',
    benefits: '₹6,000 per annum paid in 3 installments of ₹2,000 via Direct Benefit Transfer (DBT).',
    maxBenefitValueINR: 6000,
    eligibilityCriteria: {
      isFarmerOnly: true,
      maxLandAcres: 5,
      genderFilter: 'All'
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding Proof / Khasra-Khatauni Record',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Ration Card'
    ],
    applicationProcess: [
      'Visit the official PM-KISAN portal (pmkisan.gov.in) or nearest CSC/MeeSeva Center.',
      'Click on "New Farmer Registration" and enter Aadhaar details.',
      'Upload land ownership document and bank account details.',
      'Verify details via OTP sent to Aadhaar-linked mobile number.',
      'Submit for state level revenue department verification.'
    ],
    officialWebsite: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606',
    officialPdfUrl: 'https://pmkisan.gov.in/Documents/PMKISAN_Guidelines.pdf',
    tags: ['Farmer', 'Agriculture', 'Direct Cash Transfer', 'Central Scheme', 'Income Support']
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat PM-JAY',
    hindiName: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना',
    teluguName: 'ఆయుష్మాన్ భారత్ పిఎం-జెఎవై',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'Healthcare',
    isCentral: true,
    description: 'World’s largest health insurance scheme providing cashless health coverage up to ₹5 Lakh per family per year for secondary and tertiary hospital care.',
    shortDescription: 'Cashless hospital health insurance up to ₹5 Lakh per family per year.',
    benefits: 'Free hospitalization coverage up to ₹5,000,000 per family per year in empanelled public and private hospitals.',
    maxBenefitValueINR: 500000,
    eligibilityCriteria: {
      isBPLOnly: true,
      maxIncomeINR: 250000
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / SECC 2011 Listing Proof',
      'Income Certificate',
      'Mobile Number'
    ],
    applicationProcess: [
      'Check eligibility on mera.pmjay.gov.in using Aadhaar or Ration Card number.',
      'Visit nearest empanelled hospital or Ayushman Kendra at CSC.',
      'Present Aadhaar card and Ration card to Pradhan Mantri Arogya Mitra.',
      'Get biometric verification done and generate Ayushman Card instantly.'
    ],
    officialWebsite: 'https://pmjay.gov.in',
    helpline: '14555 / 1800-111-565',
    officialPdfUrl: 'https://pmjay.gov.in/sites/default/files/2018-09/AB-PMJAY_Guidelines.pdf',
    tags: ['Healthcare', 'Insurance', 'Cashless', 'Hospitalization', 'BPL', 'Central Scheme']
  },
  {
    id: 'pmay-urban-gramin',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    hindiName: 'प्रधानमंत्री आवास योजना',
    teluguName: 'ప్రధానమంత్రి ఆవాస్ యోజన',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'Housing',
    isCentral: true,
    description: 'Financial support and interest subvention for construction or purchase of pucca house for homeless and low-income families in rural and urban areas.',
    shortDescription: 'Subsidized house construction loan & grant up to ₹2.67 Lakh for Homeless/LIG families.',
    benefits: 'Financial assistance of ₹1.2 Lakh to ₹2.67 Lakh as interest subsidy or direct construction grant.',
    maxBenefitValueINR: 267000,
    eligibilityCriteria: {
      maxIncomeINR: 300000,
      isBPLOnly: false
    },
    requiredDocuments: [
      'Aadhaar Card of all family members',
      'Income Certificate',
      'Proof of land ownership or NOC from local Panchayat',
      'Bank Account Passbook',
      'Sworn Affidavit that family does not own a pucca house in India'
    ],
    applicationProcess: [
      'Apply online via pmaymis.gov.in or at local Gram Panchayat / Municipal Corporation office.',
      'Fill citizen assessment form with income category (EWS/LIG).',
      'Upload Aadhaar and land document.',
      'Verification by geo-tagging officer, followed by multi-stage fund disbursement to bank account.'
    ],
    officialWebsite: 'https://pmaymis.gov.in',
    helpline: '1800-11-6163 / 1800-11-3377',
    officialPdfUrl: 'https://pmaymis.gov.in/PDF/PMAY_Guidelines.pdf',
    tags: ['Housing', 'Pucca House', 'Subsidy', 'Homeless', 'Central Scheme']
  },
  {
    id: 'pmjjby',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    hindiName: 'प्रधानमंत्री जीवन ज्योति बीमा योजना',
    teluguName: 'ప్రధానమంత్రి జీవన్ జ్యోతి భీమా యోజన',
    ministry: 'Ministry of Finance',
    category: 'Pension & Social',
    isCentral: true,
    description: 'Renewable one-year term life insurance scheme offering ₹2 Lakh coverage for death due to any cause at a minimal premium of ₹436 per annum.',
    shortDescription: 'Life insurance cover of ₹2 Lakh for any cause of death at premium of ₹436/year.',
    benefits: '₹200,000 death benefit payable to nominee.',
    maxBenefitValueINR: 200000,
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 50
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account with Auto-debit consent',
      'Nominee Details & Aadhaar'
    ],
    applicationProcess: [
      'Visit your savings bank branch or use net-banking / mobile banking app.',
      'Submit auto-debit consent form for ₹436 annual premium.',
      'Receive instant electronic policy certificate.'
    ],
    officialWebsite: 'https://jansuraksha.gov.in',
    helpline: '1800-180-1111',
    tags: ['Insurance', 'Life Cover', 'Low Cost', 'Finance']
  },
  {
    id: 'pmsby',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    hindiName: 'प्रधानमंत्री सुरक्षा बीमा योजना',
    teluguName: 'ప్రధానమంత్రి సురక్ష భీమా యోజన',
    ministry: 'Ministry of Finance',
    category: 'Pension & Social',
    isCentral: true,
    description: 'Accidental death and disability insurance scheme providing ₹2 Lakh cover for accidental death or permanent disability for just ₹20 per year.',
    shortDescription: 'Accident insurance cover up to ₹2 Lakh for ₹20/year.',
    benefits: '₹2 Lakh for accidental death or total disability; ₹1 Lakh for partial disability.',
    maxBenefitValueINR: 200000,
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account details'
    ],
    applicationProcess: [
      'Fill simple enrollment form at bank branch or via mobile banking.',
      'Authorise annual auto-debit of ₹20 from bank account.'
    ],
    officialWebsite: 'https://jansuraksha.gov.in',
    helpline: '1800-180-1111',
    tags: ['Accident Insurance', 'Social Security', 'Finance']
  },
  {
    id: 'pmmy-mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    hindiName: 'प्रधानमंत्री मुद्रा योजना',
    teluguName: 'ప్రధానమంత్రి ముద్రా యోజన',
    ministry: 'Ministry of Finance',
    category: 'Financial & Business',
    isCentral: true,
    description: 'Collateral-free loans up to ₹10 Lakhs for micro-enterprises, small businesses, artisans, and entrepreneurs under Shishu, Kishor, and Tarun categories.',
    shortDescription: 'Collateral-free business loans up to ₹10 Lakh for small businesses and self-employed.',
    benefits: 'Loans up to ₹50,000 (Shishu), ₹5 Lakh (Kishor), and ₹10 Lakh (Tarun) without collateral.',
    maxBenefitValueINR: 1000000,
    eligibilityCriteria: {
      minAge: 18
    },
    requiredDocuments: [
      'Aadhaar Card & PAN Card',
      'Business Plan / Quotation of Machinery',
      'Bank Statement for last 6 months',
      'Address Proof of Business Establishment'
    ],
    applicationProcess: [
      'Apply online on udyamimitra.in or visit any commercial bank / RRB / NBFC.',
      'Select loan category (Shishu / Kishor / Tarun).',
      'Submit business proposal and identity documents.',
      'Loan approved and Mudra Card issued.'
    ],
    officialWebsite: 'https://www.mudra.org.in',
    helpline: '1800-180-1111',
    tags: ['Business Loan', 'Collateral Free', 'Self Employment', 'Entrepreneurs']
  },
  {
    id: 'nsp-scholarship',
    name: 'National Scholarship Portal (NSP Schemes)',
    hindiName: 'राष्ट्रीय छात्रवृत्ति पोर्टल',
    teluguName: 'నేషనల్ స్కాలర్‌షిప్ పోర్టల్',
    ministry: 'Ministry of Social Justice & Empowerment / Minority Affairs',
    category: 'Education',
    isCentral: true,
    description: 'Central sector scholarships for Pre-Matric, Post-Matric, Higher Secondary, and University students belonging to SC, ST, OBC, Minority, and EWS communities.',
    shortDescription: 'Educational scholarships up to ₹50,000/year for school and college students.',
    benefits: 'Full tuition fee waiver plus monthly maintenance allowance from ₹2,000 to ₹50,000/year.',
    maxBenefitValueINR: 50000,
    eligibilityCriteria: {
      isStudentOnly: true,
      maxIncomeINR: 250000
    },
    requiredDocuments: [
      'Student Aadhaar Card',
      'Previous Year Marksheet',
      'Caste Certificate (SC/ST/OBC/Minority)',
      'Income Certificate',
      'Fee Receipt & Bonafide Certificate from Institute'
    ],
    applicationProcess: [
      'Register on scholarships.gov.in with Aadhaar and student demographic details.',
      'Select applicable scheme based on category and education level.',
      'Upload certificates and marksheets.',
      'Verification by institute nodal officer, district officer, and direct state approval.'
    ],
    officialWebsite: 'https://scholarships.gov.in',
    helpline: '0120-6619540',
    tags: ['Student', 'Education', 'Scholarship', 'SC/ST/OBC/Minority', 'Tuition Fee']
  },
  {
    id: 'post-matric-scholarship',
    name: 'Post-Matric Scholarship for Higher Education',
    hindiName: 'उत्तरमैट्रिक छात्रवृत्ति योजना',
    teluguName: 'పోస్ట్ మెట్రిక్ స్కాలర్‌షిప్ పథకం',
    ministry: 'Ministry of Social Justice and Empowerment',
    category: 'Education',
    isCentral: true,
    description: 'Comprehensive financial assistance covering compulsory non-refundable fees and monthly maintenance allowance for students pursuing Class 11, Class 12, ITI, Diploma, Graduation, Post-Graduation, and Professional degrees.',
    shortDescription: '100% tuition reimbursement + monthly maintenance allowance for college students.',
    benefits: '100% course fee reimbursement plus monthly maintenance grant up to ₹13,500/year.',
    maxBenefitValueINR: 120000,
    eligibilityCriteria: {
      isStudentOnly: true,
      maxIncomeINR: 800000
    },
    requiredDocuments: [
      'Student Aadhaar Card',
      '10th Class Marksheet / Intermediate Certificate',
      'College Admission Fee Receipt & Bonafide Certificate',
      'Income Certificate (< ₹8 Lakh/yr)',
      'Caste Certificate (if applicable)'
    ],
    applicationProcess: [
      'Apply online via State ePASS portal or National Scholarship Portal (scholarships.gov.in).',
      'Upload college admission proof, marksheet, and income certificate.',
      'Institution verifies digital application, followed by District Social Welfare sanction.'
    ],
    officialWebsite: 'https://scholarships.gov.in',
    helpline: '1800-11-2001',
    tags: ['Student', 'Higher Education', 'College Scholarship', 'Tuition Reimbursement', 'Degree']
  },
  {
    id: 'pm-vidyalaxmi',
    name: 'PM Vidyalaxmi Education Loan & Subsidy Scheme',
    hindiName: 'पीएम विद्यालक्ष्मी शिक्षा ऋण योजना',
    teluguName: 'పిఎం విద్యాలక్ష్మి విద్యా రుణం',
    ministry: 'Ministry of Education / Department of Higher Education',
    category: 'Education',
    isCentral: true,
    description: 'Central sector scheme providing collateral-free education loans up to ₹10 Lakhs with 3% interest subvention for meritorious students pursuing higher studies in top 860 higher educational institutions.',
    shortDescription: 'Collateral-free education loans up to ₹10 Lakh + 3% interest subsidy for college students.',
    benefits: 'Collateral-free, third-party guarantee-free education loan with 3% interest subvention during course moratorium period.',
    maxBenefitValueINR: 1000000,
    eligibilityCriteria: {
      isStudentOnly: true,
      maxIncomeINR: 800000
    },
    requiredDocuments: [
      'Student Aadhaar & PAN Card',
      'Class 10th & 12th Marksheets / Entrance Rank Card',
      'College Admission Letter & Detailed Fee Structure',
      'Parent Income Certificate'
    ],
    applicationProcess: [
      'Register on PM Vidyalaxmi Portal (vidyalakshmi.co.in).',
      'Fill Common Education Loan Application Form (CELAF).',
      'Apply to up to 3 bank branches simultaneously with digital document submission.',
      'Sanction letter issued digitally within 15 days.'
    ],
    officialWebsite: 'https://www.vidyalakshmi.co.in',
    helpline: '1800-180-1111',
    tags: ['Student', 'Education Loan', 'Collateral Free', 'Higher Education', 'Interest Subsidy']
  },
  {
    id: 'pm-ujjwala',
    name: 'Pradhan Mantri Ujjwala Yojana 2.0',
    hindiName: 'प्रधानमंत्री उज्जवला योजना 2.0',
    teluguName: 'ప్రధానమంత్రి ఉజ్వల యోజన',
    ministry: 'Ministry of Petroleum and Natural Gas',
    category: 'Women & Child',
    isCentral: true,
    description: 'Deposit-free LPG connection along with free first refill and stove for adult women belonging to poor households across India.',
    shortDescription: 'Free LPG gas connection + free first cylinder + stove for women in BPL households.',
    benefits: 'Free LPG connection, cylinder, pressure regulator, gas stove, and subsidy of ₹300 per refill.',
    maxBenefitValueINR: 3200,
    eligibilityCriteria: {
      genderFilter: 'Female',
      minAge: 18,
      isBPLOnly: true
    },
    requiredDocuments: [
      'Aadhaar Card of Applicant (Woman)',
      'Ration Card featuring all family members',
      'Bank Account Passbook linked to Aadhaar',
      'BPL Certificate / Self-Declaration'
    ],
    applicationProcess: [
      'Apply online on pmuy.gov.in or visit local Indane, Bharatgas, or HP Gas distributor.',
      'Submit KYC form along with Aadhaar and Ration card.',
      'Physical inspection and gas stove setup at home.'
    ],
    officialWebsite: 'https://www.pmuy.gov.in',
    helpline: '1800-266-6696 / 1906',
    tags: ['Women Empowerment', 'LPG Connection', 'Cooking Gas', 'BPL', 'Clean Energy']
  },
  {
    id: 'kisan-credit-card',
    name: 'Kisan Credit Card (KCC) Scheme',
    hindiName: 'किसान क्रेडिट कार्ड योजना',
    teluguName: 'కిసాన్ క్రెడిట్ కార్డ్ పథకం',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    isCentral: true,
    description: 'Provides timely and adequate credit to farmers for crop cultivation, post-harvest expenses, livestock, and fisheries at a concessional interest rate of 4% per annum.',
    shortDescription: 'Concessional crop credit loan up to ₹3 Lakh at effective 4% interest rate.',
    benefits: 'Revolving credit up to ₹3 Lakh at subsidized interest rates with interest subvention.',
    maxBenefitValueINR: 300000,
    eligibilityCriteria: {
      isFarmerOnly: true,
      minAge: 18,
      maxAge: 75
    },
    requiredDocuments: [
      'Aadhaar Card & PAN Card',
      'Landholding Record (Pahani / Khasra)',
      'Crop Cultivation Details',
      'No Dues Certificate from nearby banks'
    ],
    applicationProcess: [
      'Fill KCC application form available at pmkisan.gov.in or any bank branch.',
      'Submit land documents and crop plan.',
      'Bank issues Kisan Credit Card within 14 days.'
    ],
    officialWebsite: 'https://pmkisan.gov.in',
    helpline: '1800-115-526',
    tags: ['Farmer', 'Credit Loan', 'Subsidized Interest', 'Agriculture']
  },
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi (Street Vendor\'s AtmaNirbhar Nidhi)',
    hindiName: 'पीएम स्वनिधि योजना',
    teluguName: 'పిఎం స్వనిధి',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'Financial & Business',
    isCentral: true,
    description: 'Micro-credit scheme providing collateral-free working capital loans starting from ₹10,000 up to ₹50,000 to street vendors with 7% interest subsidy on prompt repayment.',
    shortDescription: 'Collateral-free loan from ₹10,000 to ₹50,000 for street vendors and hawkers.',
    benefits: 'Initial working capital loan of ₹10,000, progressing to ₹20,000 and ₹50,000 upon timely repayment, plus cashback on digital transactions.',
    maxBenefitValueINR: 50000,
    eligibilityCriteria: {
      minAge: 18,
      requiredOccupations: ['Street Vendor', 'Hawker', 'Artisan', 'Small Trader']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Certificate of Vending (CoV) / Identity Card issued by Urban Local Body',
      'Bank Account Details'
    ],
    applicationProcess: [
      'Visit pmsvanidhi.mohua.gov.in or nearest CSC.',
      'Select lending institution.',
      'Upload Vending identity card and bank account.',
      'Sanctioned directly to bank account within 7 days.'
    ],
    officialWebsite: 'https://pmsvanidhi.mohua.gov.in',
    helpline: '1800-11-1979',
    tags: ['Street Vendors', 'Working Capital', 'Micro Loan', 'Urban Poor']
  },
  {
    id: 'atal-pension-yojana',
    name: 'Atal Pension Yojana (APY)',
    hindiName: 'अटल पेंशन योजना',
    teluguName: 'అటల్ పెన్షన్ యోజన',
    ministry: 'Ministry of Finance / PFRDA',
    category: 'Pension & Social',
    isCentral: true,
    description: 'Guaranteed pension scheme for unorganized sector workers delivering fixed monthly pension ranging from ₹1,000 to ₹5,000 per month from age 60.',
    shortDescription: 'Guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60 for unorganized workers.',
    benefits: 'Guaranteed lifetime monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000.',
    maxBenefitValueINR: 60000, // per year pension
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 40
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account',
      'Mobile Number'
    ],
    applicationProcess: [
      'Approach nearest bank branch or post office.',
      'Fill APY registration form with choice of pension amount.',
      'Set up monthly auto-debit based on joining age.'
    ],
    officialWebsite: 'https://www.npscra.nsdl.co.in',
    helpline: '1800-110-069',
    tags: ['Pension', 'Unorganized Sector', 'Retirement', 'Guaranteed Income']
  },
  {
    id: 'eshram-card',
    name: 'eShram Portal & Accidental Insurance Cover',
    hindiName: 'ई-श्रम कार्ड योजना',
    teluguName: 'ఈ-శ్రమ్ కార్డ్',
    ministry: 'Ministry of Labour and Employment',
    category: 'Employment & Skill',
    isCentral: true,
    description: 'National database of unorganized workers providing a 12-digit UWIN eShram card, free PMSBY accidental death/disability insurance up to ₹2 Lakh, and eligibility for social welfare schemes.',
    shortDescription: 'Free National ID card for unorganized workers with ₹2 Lakh free accident insurance.',
    benefits: 'Free ₹2 Lakh accidental insurance cover, direct eligibility for central emergency financial aids, and skill migration support.',
    maxBenefitValueINR: 200000,
    eligibilityCriteria: {
      minAge: 16,
      maxAge: 59,
      isBPLOnly: false
    },
    requiredDocuments: [
      'Aadhaar Card linked with active mobile number',
      'Bank Account Passbook',
      'Occupation / Skill Category'
    ],
    applicationProcess: [
      'Visit eshram.gov.in or nearest CSC center.',
      'Enter Aadhaar number and OTP.',
      'Fill occupational details and bank info.',
      'Download eShram Card with UWIN ID instantly.'
    ],
    officialWebsite: 'https://eshram.gov.in',
    helpline: '14434',
    tags: ['Unorganized Worker', 'Labor Card', 'Accident Insurance', 'Central Database']
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    hindiName: 'पीएम विश्वकर्मा योजना',
    teluguName: 'పిఎం విశ్వకర్మ పథకం',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    category: 'Financial & Business',
    isCentral: true,
    description: 'Comprehensive support for traditional artisans and craftspeople across 18 trades (carpenter, blacksmith, goldsmith, potter, cobbler, tailor, mason, etc.) providing skill training, ₹15,000 toolkit digital incentive, and collateral-free loans up to ₹3 Lakh at 5% interest.',
    shortDescription: 'Artisan credit up to ₹3 Lakh at 5% interest + ₹15,000 free toolkit incentive + skill stipend.',
    benefits: '₹15,000 toolkit voucher + ₹500/day training stipend + ₹1 Lakh (Tranche 1) and ₹2 Lakh (Tranche 2) loan at 5% interest rate.',
    maxBenefitValueINR: 315000,
    eligibilityCriteria: {
      minAge: 18,
      requiredOccupations: ['Artisan', 'Carpenter', 'Blacksmith', 'Potter', 'Mason', 'Tailor', 'Cobbler', 'Barber', 'Goldsmith', 'Sculptor']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Trade Skill Certificate / Self-Declaration',
      'Bank Account Details',
      'Ration Card'
    ],
    applicationProcess: [
      'Register at pmvishwakarma.gov.in via CSC.',
      'Biometric authentication and trade verification by Gram Panchayat / Urban Body.',
      'Undergo 5 to 7 days basic skill training with ₹500 daily stipend.',
      'Receive ₹15,000 toolkit e-voucher and loan approval.'
    ],
    officialWebsite: 'https://pmvishwakarma.gov.in',
    helpline: '1800-267-7777',
    tags: ['Artisan', 'Craftspeople', 'Toolkit Grant', 'Subsidized Loan', 'Skill Development']
  },
  {
    id: 'pm-fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    hindiName: 'प्रधानमंत्री फसल बीमा योजना',
    teluguName: 'ప్రధానమంత్రి ఫసల్ భీమా యోజన',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    isCentral: true,
    description: 'Comprehensive crop insurance covering yield loss due to non-preventable natural risks (drought, flood, cyclone, hailstorm, pest attack) at minimal premium rates (1.5% for Rabi, 2% for Kharif).',
    shortDescription: 'Comprehensive crop damage insurance cover with full financial compensation for farmers.',
    benefits: 'Complete claim payout matching loss in crop yield directly transferred to farmer bank account.',
    maxBenefitValueINR: 150000,
    eligibilityCriteria: {
      isFarmerOnly: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Land Ownership / Tenant Cultivator Proof (Pahani)',
      'Sowing Certificate issued by Agriculture Officer',
      'Bank Passbook'
    ],
    applicationProcess: [
      'Apply online on pmfby.gov.in within cut-off date for Kharif/Rabi season.',
      'Pay low farmer premium (1.5% to 2%).',
      'In case of crop loss, report within 72 hours via PMFBY App or toll-free helpline.'
    ],
    officialWebsite: 'https://pmfby.gov.in',
    helpline: '1800-180-1551',
    tags: ['Crop Insurance', 'Farmer Safety', 'Drought Relief', 'Agriculture']
  },
  {
    id: 'rythu-bandhu-telangana',
    name: 'Telangana Rythu Bharosa / Rythu Bandhu',
    hindiName: 'तेलंगाना रैतु बंधु योजना',
    teluguName: 'తెలంగాణ రైతు భరోసా / రైతు బంధు',
    ministry: 'Department of Agriculture, Govt of Telangana',
    category: 'Agriculture',
    isCentral: false,
    targetStates: ['Telangana'],
    description: 'State-level farmer investment support scheme offering ₹10,000 to ₹15,000 per acre per year for purchasing seeds, fertilizers, pesticides, and field preparation.',
    shortDescription: '₹12,000 to ₹15,000/acre yearly cash grant for Telangana farmers for crop inputs.',
    benefits: '₹7,500 per acre per season (Kharif and Rabi) deposited directly into bank account.',
    maxBenefitValueINR: 30000,
    eligibilityCriteria: {
      isFarmerOnly: true,
      genderFilter: 'All'
    },
    requiredDocuments: [
      'Pattadar Passbook (Pattadar ID)',
      'Aadhaar Card',
      'Bank Account Passbook'
    ],
    applicationProcess: [
      'Submit Pattadar passbook details to local Agriculture Extension Officer (AEO).',
      'Details verified against Dharani portal.',
      'Funds credited via DBT prior to sowing season.'
    ],
    officialWebsite: 'https://rythubandhu.telangana.gov.in',
    helpline: '1800-425-3535',
    tags: ['Telangana State', 'Farmer Support', 'Agricultural Grant', 'Rythu Bharosa']
  },
  {
    id: 'mahalakshmi-telangana',
    name: 'Telangana Mahalakshmi Scheme',
    hindiName: 'तेलंगाना महालक्ष्मी योजना',
    teluguName: 'తెలంగాణ మహాలక్ష్మి పథకం',
    ministry: 'Department of Women & Child Welfare, Govt of Telangana',
    category: 'Women & Child',
    isCentral: false,
    targetStates: ['Telangana'],
    description: 'Multi-pronged welfare scheme for women in Telangana providing free travel in TSRTC buses, financial assistance of ₹2,500 monthly for eligible women, and LPG gas cylinders for ₹500.',
    shortDescription: 'Free TSRTC bus travel + ₹2,500 monthly grant + ₹500 gas cylinder for Telangana women.',
    benefits: '100% free bus travel, ₹2,500/month financial aid, LPG cylinder at ₹500.',
    maxBenefitValueINR: 35000,
    eligibilityCriteria: {
      genderFilter: 'Female',
      minAge: 18,
      isBPLOnly: true
    },
    requiredDocuments: [
      'Telangana Residence Proof / Food Security Card',
      'Aadhaar Card',
      'Bank Account Passbook'
    ],
    applicationProcess: [
      'Show Aadhaar / Resident ID for instant free bus travel.',
      'Submit Praja Palana application form at local ward / Gram Sabha for monthly aid and ₹500 LPG cylinder.'
    ],
    officialWebsite: 'https://prajapalana.telangana.gov.in',
    helpline: '040-23450552',
    tags: ['Telangana State', 'Free Bus Travel', 'Women Cash Support', 'Subsidized LPG']
  },
  {
    id: 'kanya-sumangala-up',
    name: 'Mukhya Mantri Kanya Sumangala Yojana (Uttar Pradesh)',
    hindiName: 'मुख्यमंत्री कन्या सुमंगला योजना (उत्तर प्रदेश)',
    teluguName: 'ముఖ్యమంత్రి కన్యా సుమంగళ యోజన',
    ministry: 'Department of Women and Child Development, Uttar Pradesh',
    category: 'Women & Child',
    isCentral: false,
    targetStates: ['Uttar Pradesh'],
    description: 'Conditional cash transfer scheme in UP providing financial support of ₹25,000 in 6 installments from girl child birth through vaccination, school enrollment, to graduation.',
    shortDescription: '₹25,000 financial support for girl children in UP across 6 educational milestones.',
    benefits: 'Total grant of ₹25,000 per girl child paid directly in bank account at key life milestones.',
    maxBenefitValueINR: 25000,
    eligibilityCriteria: {
      genderFilter: 'Female',
      maxIncomeINR: 300000
    },
    requiredDocuments: [
      'Birth Certificate of Girl Child',
      'UP Domicile Certificate',
      'Family Income Certificate (< ₹3 Lakh)',
      'Joint photo of parent and child',
      'Bank Passbook of Mother/Father'
    ],
    applicationProcess: [
      'Apply online at mksy.up.gov.in.',
      'Select applicable milestone category (Birth, Vaccination, Class 1, Class 6, Class 9, Degree/Diploma).',
      'Verification by District Probation Officer.'
    ],
    officialWebsite: 'https://mksy.up.gov.in',
    helpline: '1800-833-0100',
    tags: ['Uttar Pradesh', 'Girl Child', 'Education Grant', 'State Welfare']
  },
  {
    id: 'stand-up-india',
    name: 'Stand-Up India Scheme',
    hindiName: 'स्टैंड-अप इंडिया योजना',
    teluguName: 'స్టాండ్-అప్ ఇండియా',
    ministry: 'Ministry of Finance',
    category: 'Financial & Business',
    isCentral: true,
    description: 'Bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.',
    shortDescription: 'Business loans from ₹10 Lakh to ₹1 Crore for Women and SC/ST entrepreneurs.',
    benefits: 'Bank financing covering up to 75% of greenfield project cost with low interest margin.',
    maxBenefitValueINR: 10000000,
    eligibilityCriteria: {
      minAge: 18,
      allowedCastes: ['SC', 'ST']
    },
    requiredDocuments: [
      'Aadhaar Card, PAN Card',
      'Caste Certificate (for SC/ST) or Female Identity',
      'Project Report & Land/Lease Documents',
      'Pollution Clearance / Trade License'
    ],
    applicationProcess: [
      'Apply via standupmitra.in portal or visit scheduled commercial bank.',
      'Prepare detailed greenfield project report with handholding support.',
      'Sanctioned with Credit Guarantee Fund backing.'
    ],
    officialWebsite: 'https://www.standupmitra.in',
    helpline: '1800-180-1111',
    tags: ['Women Entrepreneur', 'SC/ST Loan', 'Greenfield Project', 'Large Credit']
  },
  {
    id: 'pmkvY-skill-india',
    name: 'Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY)',
    hindiName: 'प्रधानमंत्री कौशल विकास योजना 4.0',
    teluguName: 'ప్రధానమంత్రి కౌశల్ వికాస్ యోజన',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    category: 'Employment & Skill',
    isCentral: true,
    description: 'Free industry-relevant skill training, certification, digital technology literacy, and placement assistance for unemployed youth and school dropouts.',
    shortDescription: 'Free skill training certification, digital courses, and job placement assistance.',
    benefits: 'Free course training, NSQF recognized skill certification, and ₹8,000 stipend reward upon placement.',
    maxBenefitValueINR: 8000,
    eligibilityCriteria: {
      minAge: 15,
      maxAge: 45
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Education Qualification Marksheet',
      'Bank Account Passbook'
    ],
    applicationProcess: [
      'Register on Skill India Digital portal (skillindiadigital.gov.in).',
      'Select trade sector (AI, Robotics, Solar, Tailoring, Healthcare, Automotive, Retail).',
      'Locate nearest PMKK Training Center for offline/online enrollment.'
    ],
    officialWebsite: 'https://www.pmkvyofficial.org',
    helpline: '011-47451600',
    tags: ['Skill Development', 'Free Certification', 'Youth Placement', 'Employment']
  },
  {
    id: 'startup-india-seed-fund',
    name: 'Startup India Seed Fund Scheme (SISFS)',
    hindiName: 'स्टार्टअप इंडिया सीड फंड योजना',
    teluguName: 'స్టార్టప్ ఇండియా సీడ్ ఫండ్',
    ministry: 'Ministry of Commerce and Industry / DPIIT',
    category: 'Financial & Business',
    isCentral: true,
    description: 'Financial assistance to DPIIT-recognized startups for proof of concept, prototype development, product trials, market entry, and commercialization.',
    shortDescription: 'Grants up to ₹20 Lakhs for prototype and up to ₹50 Lakhs seed debt for DPIIT startups.',
    benefits: 'Grant up to ₹20 Lakh for proof of concept/prototype; debt/convertible debenture up to ₹50 Lakh for market entry.',
    maxBenefitValueINR: 5000000,
    eligibilityCriteria: {
      minAge: 18
    },
    requiredDocuments: [
      'DPIIT Recognition Certificate',
      'Company Incorporation Certificate',
      'Pitch Deck & Product Demo Video',
      'Founder Aadhaar & PAN'
    ],
    applicationProcess: [
      'Apply on seedfund.startupindia.gov.in.',
      'Select eligible incubator approved under SISFS.',
      'Incubator committee evaluates pitch and releases milestone-based funds.'
    ],
    officialWebsite: 'https://seedfund.startupindia.gov.in',
    helpline: '1800-115-565',
    tags: ['Startup', 'Innovation Grant', 'Seed Funding', 'Commercialization']
  },
  {
    id: 'jan-dhan-yojana',
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    hindiName: 'प्रधानमंत्री जन धन योजना',
    teluguName: 'ప్రధానమంత్రి జన్ ధన్ యోజన',
    ministry: 'Ministry of Finance',
    category: 'Financial & Business',
    isCentral: true,
    description: 'National Mission for Financial Inclusion providing zero balance bank accounts, free RuPay debit card, ₹2 Lakh accident insurance, and ₹10,000 overdraft facility.',
    shortDescription: 'Zero balance savings account + RuPay debit card + ₹10,000 bank overdraft facility.',
    benefits: 'Zero minimum balance required, free RuPay debit card with ₹2 Lakh accident insurance cover, and ₹10,000 overdraft facility after 6 months.',
    maxBenefitValueINR: 10000,
    eligibilityCriteria: {
      minAge: 10
    },
    requiredDocuments: [
      'Aadhaar Card OR Passport / Voter ID / Driving License',
      'Passport size photograph'
    ],
    applicationProcess: [
      'Visit any public or private sector bank branch or Bank Mitra.',
      'Fill PMJDY account opening form.',
      'Receive instant RuPay Debit Card.'
    ],
    officialWebsite: 'https://pmjdy.gov.in',
    helpline: '1800-110-001',
    tags: ['Bank Account', 'Zero Balance', 'Overdraft', 'Financial Inclusion']
  },
  {
    id: 'pm-surya-ghar',
    name: 'PM Surya Ghar: Muft Bijli Yojana',
    hindiName: 'पीएम सूर्य घर: मुफ्त बिजली योजना',
    teluguName: 'పిఎం సూర్య ఘర్ ఉచిత విద్యుత్ పథకం',
    ministry: 'Ministry of New and Renewable Energy',
    category: 'Energy',
    isCentral: true,
    description: 'Provides free electricity up to 300 units per month to 1 crore households across India through rooftop solar installations, with government subsidy up to ₹78,000.',
    shortDescription: 'Free solar electricity up to 300 units/month + subsidy up to ₹78,000 for rooftop solar.',
    benefits: 'Subsidy of ₹30,000 for 1kW, ₹60,000 for 2kW, and ₹78,000 for 3kW rooftop solar systems plus up to 300 free units of electricity/month.',
    maxBenefitValueINR: 78000,
    eligibilityCriteria: {
      isBPLOnly: false
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Electricity Bill (Last 3 months)',
      'Bank Account Passbook',
      'Proof of House Ownership'
    ],
    applicationProcess: [
      'Register on pmsuryaghar.gov.in using state electricity DISCOM details.',
      'Submit rooftop solar feasibility request.',
      'Get solar panels installed by empaneled vendor and submit net metering request.',
      'Subsidy credited directly to bank account within 30 days.'
    ],
    officialWebsite: 'https://pmsuryaghar.gov.in',
    helpline: '15555 / 1800-180-3333',
    tags: ['Energy', 'Solar Rooftop', 'Free Electricity', 'Subsidy', 'Renewable Energy']
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM Solar Pump Scheme',
    hindiName: 'पीएम-कुसुम सोलर पंप योजना',
    teluguName: 'పిఎం-కుసుమ్ సోలార్ పంప్ పథకం',
    ministry: 'Ministry of New and Renewable Energy',
    category: 'Energy',
    isCentral: true,
    description: 'De-grid irrigation pump sets and replace diesel agricultural pumps with clean solar power, providing up to 90% subsidy for farmers.',
    shortDescription: 'Up to 90% subsidy for standalone solar agriculture pumps for farmers.',
    benefits: '60% government subsidy (Central + State) and 30% bank loan for solar water pump installation.',
    maxBenefitValueINR: 120000,
    eligibilityCriteria: {
      isFarmerOnly: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Agricultural Land Records (Pahani / Khasra)',
      'Bank Account Passbook',
      'Electricity connection NOC'
    ],
    applicationProcess: [
      'Apply online via state renewable energy portal (e.g. REDCO / MNRE).',
      'Select solar pump capacity (3HP, 5HP, 7.5HP).',
      'Pay 10% farmer share.',
      'Installation completed by vendor within 45 days.'
    ],
    officialWebsite: 'https://pmkusum.mnre.gov.in',
    helpline: '1800-180-3333',
    tags: ['Energy', 'Farmer', 'Solar Pump', 'Agriculture', 'Clean Energy']
  },
  {
    id: 'pm-vaya-vandana',
    name: 'Pradhan Mantri Vaya Vandana Yojana (PMVVY)',
    hindiName: 'प्रधानमंत्री वय वंदना योजना',
    teluguName: 'ప్రధానమంత్రి వయ వందన యోజన',
    ministry: 'Ministry of Finance / LIC of India',
    category: 'Senior Citizens',
    isCentral: true,
    description: 'Government pension scheme exclusively for senior citizens aged 60 years and above providing guaranteed interest rate return of 7.4% per annum payable monthly.',
    shortDescription: 'Guaranteed pension with 7.4% p.a. return for senior citizens aged 60 and above.',
    benefits: 'Guaranteed monthly pension up to ₹9,250/month for 10 years backed by Government of India.',
    maxBenefitValueINR: 111000,
    eligibilityCriteria: {
      minAge: 60
    },
    requiredDocuments: [
      'Aadhaar Card (Proof of Age 60+)',
      'PAN Card',
      'Bank Account Passbook for Monthly Auto-Credit',
      'Passport size photograph'
    ],
    applicationProcess: [
      'Apply online via licindia.in or visit any LIC branch.',
      'Purchase pension policy with lump sum purchase price.',
      'Monthly pension automatically credited on 1st of every month.'
    ],
    officialWebsite: 'https://licindia.in',
    helpline: '022-68276827',
    tags: ['Senior Citizens', 'Pension', 'Guaranteed Interest', 'Elder Care', 'LIC']
  },
  {
    id: 'ignoaps-senior-pension',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    hindiName: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना',
    teluguName: 'ఇందిరా గాంధీ జాతీయ వయోవృద్ధుల పెన్షన్ పథకం',
    ministry: 'Ministry of Rural Development',
    category: 'Senior Citizens',
    isCentral: true,
    description: 'Monthly cash pension support for senior citizens aged 60 years and above belonging to Below Poverty Line (BPL) households across all states.',
    shortDescription: 'Monthly cash pension for senior citizens aged 60+ in BPL families.',
    benefits: 'Monthly financial pension (₹500 to ₹3,000 depending on age and state top-up) directly into bank account.',
    maxBenefitValueINR: 36000,
    eligibilityCriteria: {
      minAge: 60,
      isBPLOnly: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Age Proof (Voter ID / Birth Certificate)',
      'BPL Ration Card',
      'Bank Passbook'
    ],
    applicationProcess: [
      'Apply at local Tehsildar Office / Gram Panchayat / MeeSeva Center.',
      'Verification of BPL status and age 60+ by Revenue Department.',
      'Monthly pension credited via Direct Benefit Transfer (DBT).'
    ],
    officialWebsite: 'https://nsap.nic.in',
    helpline: '1800-111-555',
    tags: ['Senior Citizens', 'BPL Pension', 'Elderly Support', 'Social Security']
  }
];
