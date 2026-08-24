export type Language = 'en' | 'hi' | 'te';

export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'Minority';

export type EducationLevel = 'Illiterate' | 'Below 10th' | '10th Pass' | '12th Pass' | 'Graduate' | 'Post Graduate';

export interface CitizenProfile {
  name?: string;
  state?: string;
  district?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'All';
  annualIncome?: number; // In INR per annum
  occupation?: string; // Farmer, Student, Artisan, Small Business, Unemployed, Salaried, Daily Wager
  education?: EducationLevel;
  isFarmer?: boolean;
  isStudent?: boolean;
  isWidow?: boolean;
  hasDisability?: boolean;
  isMinority?: boolean;
  caste?: CasteCategory;
  landholdingAcres?: number;
  employmentStatus?: string;
  familySize?: number;
  isBPL?: boolean; // Below Poverty Line
  hasAadhaar?: boolean;
  hasBankAccount?: boolean;
  hasRationCard?: boolean;
}

export const EMPTY_CITIZEN_PROFILE: CitizenProfile = {
  name: '',
  state: '',
  district: '',
  age: undefined,
  gender: undefined,
  annualIncome: undefined,
  occupation: '',
  education: undefined,
  isFarmer: false,
  isStudent: false,
  isWidow: false,
  hasDisability: false,
  isMinority: false,
  caste: undefined,
  landholdingAcres: 0,
  employmentStatus: '',
  familySize: undefined,
  isBPL: false,
  hasAadhaar: false,
  hasBankAccount: false,
  hasRationCard: false
};

export interface GovernmentScheme {
  id: string;
  name: string;
  hindiName?: string;
  teluguName?: string;
  ministry: string;
  department?: string;
  category: 
    | 'Agriculture' 
    | 'Healthcare' 
    | 'Health'
    | 'Housing' 
    | 'Education' 
    | 'Pension & Social' 
    | 'Financial & Business' 
    | 'Women & Child' 
    | 'Employment & Skill'
    | 'Employment'
    | 'Energy'
    | 'Senior Citizens';
  isCentral: boolean; // true = Central, false = State specific
  targetStates?: string[]; // Empty means all states
  description: string;
  shortDescription: string;
  benefits: string;
  maxBenefitValueINR?: number;
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    maxIncomeINR?: number;
    requiredOccupations?: string[];
    maxLandAcres?: number;
    genderFilter?: 'Male' | 'Female' | 'Other' | 'All';
    isBPLOnly?: boolean;
    isFarmerOnly?: boolean;
    isStudentOnly?: boolean;
    isWidowOnly?: boolean;
    hasDisabilityOnly?: boolean;
    allowedCastes?: CasteCategory[];
  };
  requiredDocuments: string[];
  applicationProcess: string[];
  officialWebsite: string;
  officialPortal?: string;
  helpline: string;
  officialPdfUrl?: string;
  sourceUrl?: string;
  sourceDocument?: string;
  lastVerifiedAt?: string;
  effectiveFrom?: string;
  tags: string[];
}

export interface EligibilityResult {
  schemeId: string;
  scheme: GovernmentScheme;
  score: number; // 0 to 100
  status: 'Highly Eligible' | 'Moderately Eligible' | 'Requires Documents' | 'Ineligible';
  matchedCriteria: string[];
  missingCriteria: string[];
  explanation: string;
  recommendedNextSteps: string[];
}

export interface ResponseFeedback {
  id: string;
  messageId: string;
  sessionId?: string;
  userQuery?: string;
  aiResponseSnippet?: string;
  rating: 'thumbs_up' | 'thumbs_down';
  comment?: string;
  tags?: string[];
  timestamp: string;
  status?: 'Pending' | 'Reviewed' | 'Resolved';
  citizenState?: string;
}

export interface RagCitation {
  schemeId: string;
  schemeName: string;
  ministry: string;
  section: string;
  relevantExcerpt: string;
  officialWebsite: string;
  helpline: string;
  confidenceScore: number;
  lastVerifiedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  extractedProfileData?: Partial<CitizenProfile>;
  matchedSchemes?: EligibilityResult[];
  language?: Language;
  audioUrl?: string;
  feedback?: ResponseFeedback;
  ragCitations?: RagCitation[];
  ragSources?: GovernmentScheme[];
  confidenceScore?: number;
  noInformationFound?: boolean;
}

export interface GovernmentCenter {
  id: string;
  name: string;
  type: 'CSC Center' | 'MeeSeva' | 'Tehsildar Office' | 'Bank Branch' | 'District Office' | 'Government Hospital';
  address: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  openingHours: string;
  lat: number;
  lng: number;
  distanceKm?: number;
}

export interface SavedSchemeItem {
  schemeId: string;
  savedAt: string;
  status: 'Bookmarked' | 'Documents Prepared' | 'Applied' | 'Approved' | 'Benefit Received';
  notes?: string;
}

export interface ApplicationTrackingItem {
  id?: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  status: 'Guidance Started' | 'Documents Prepared' | 'Redirected to Official Portal' | 'Application Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  applicationNumber: string;
  appliedDate: string;
  updatedAt: string;
  officialPortalUrl?: string;
  notes?: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  chatSessionsToday: number;
  schemesMatchedTotal: number;
  avgResponseTimeMs: number;
  categoryDistribution: { name: string; count: number }[];
  stateDistribution: { name: string; count: number }[];
  languageUsage: { name: string; percentage: number }[];
  recentFeedback: { id: string; rating: number; comment: string; date: string }[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

