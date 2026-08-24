import { CitizenProfile } from '../types.js';

export interface UserMemoryContext {
  userId?: string;
  rememberedProfile: Partial<CitizenProfile>;
  familyInformation?: string;
  uploadedDocuments: Array<{ id: string; name: string; scannedAt: string; docType: string }>;
  recommendedSchemes: string[]; // scheme IDs
  appliedSchemes: string[]; // scheme IDs
  userPreferences: {
    language: string;
    preferredMinistry?: string;
    notificationChannels?: string[];
  };
  conversationSummary?: string;
  vectorMemoryLogs: Array<{
    id: string;
    query: string;
    aiResponse: string;
    timestamp: string;
    relevanceTags: string[];
  }>;
}

// Memory Compression & Token Optimization
export function compressConversationHistory(
  messages: Array<{ sender: string; text: string; timestamp?: string }>,
  existingSummary: string = ''
): { compressedSummary: string; recentMessages: Array<{ sender: string; text: string }> } {
  // Retain last 4 messages for immediate turn context
  const RECENT_WINDOW = 4;
  if (messages.length <= RECENT_WINDOW) {
    return {
      compressedSummary: existingSummary,
      recentMessages: messages.map(m => ({ sender: m.sender, text: m.text }))
    };
  }

  const olderMessages = messages.slice(0, messages.length - RECENT_WINDOW);
  const recentMessages = messages.slice(messages.length - RECENT_WINDOW).map(m => ({ sender: m.sender, text: m.text }));

  // Extract key facts from older messages to compress memory
  const extractedFacts: string[] = [];
  olderMessages.forEach(msg => {
    if (msg.sender === 'user') {
      if (msg.text.toLowerCase().includes('income')) extractedFacts.push(`User mentioned income details.`);
      if (msg.text.toLowerCase().includes('farmer')) extractedFacts.push(`User discussed agricultural status.`);
      if (msg.text.toLowerCase().includes('student')) extractedFacts.push(`User discussed education/student status.`);
      if (msg.text.toLowerCase().includes('scheme')) extractedFacts.push(`User queried government schemes.`);
    }
  });

  const uniqueFacts = Array.from(new Set(extractedFacts));
  const newSummary = existingSummary 
    ? `${existingSummary} | Earlier: ${uniqueFacts.join(' ')}` 
    : `Conversation Memory: ${uniqueFacts.join(' ')}`;

  return {
    compressedSummary: newSummary.slice(0, 500), // Enforce token cap
    recentMessages
  };
}

// Vector & Keyword Semantic Memory Retrieval across past user conversations
export function retrieveSemanticMemoryContext(
  userQuery: string,
  memoryLogs: UserMemoryContext['vectorMemoryLogs'],
  topK: number = 3
): Array<{ query: string; aiResponse: string; score: number }> {
  if (!memoryLogs || memoryLogs.length === 0) return [];

  const queryTerms = userQuery.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (queryTerms.length === 0) return [];

  const scored = memoryLogs.map(log => {
    const textToMatch = `${log.query} ${log.aiResponse} ${log.relevanceTags.join(' ')}`.toLowerCase();
    let hits = 0;
    queryTerms.forEach(term => {
      if (textToMatch.includes(term)) hits++;
    });

    const score = Math.min(1.0, hits / queryTerms.length);
    return {
      query: log.query,
      aiResponse: log.aiResponse,
      score
    };
  });

  return scored
    .filter(s => s.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Merge new facts into long-term memory without overwriting existing known facts unless explicitly provided
export function updateLongTermMemoryProfile(
  existingProfile: CitizenProfile,
  newDisclosures: Partial<CitizenProfile>
): CitizenProfile {
  return {
    ...existingProfile,
    // Only update fields that are defined in newDisclosures
    name: newDisclosures.name !== undefined ? newDisclosures.name : existingProfile.name,
    state: newDisclosures.state !== undefined ? newDisclosures.state : existingProfile.state,
    district: newDisclosures.district !== undefined ? newDisclosures.district : existingProfile.district,
    age: newDisclosures.age !== undefined ? newDisclosures.age : existingProfile.age,
    gender: newDisclosures.gender !== undefined ? newDisclosures.gender : existingProfile.gender,
    annualIncome: newDisclosures.annualIncome !== undefined ? newDisclosures.annualIncome : existingProfile.annualIncome,
    occupation: newDisclosures.occupation !== undefined ? newDisclosures.occupation : existingProfile.occupation,
    education: newDisclosures.education !== undefined ? newDisclosures.education : existingProfile.education,
    isFarmer: newDisclosures.isFarmer !== undefined ? newDisclosures.isFarmer : existingProfile.isFarmer,
    isStudent: newDisclosures.isStudent !== undefined ? newDisclosures.isStudent : existingProfile.isStudent,
    caste: newDisclosures.caste !== undefined ? newDisclosures.caste : existingProfile.caste,
    isBPL: newDisclosures.isBPL !== undefined ? newDisclosures.isBPL : existingProfile.isBPL,
    hasAadhaar: newDisclosures.hasAadhaar !== undefined ? newDisclosures.hasAadhaar : existingProfile.hasAadhaar,
    hasBankAccount: newDisclosures.hasBankAccount !== undefined ? newDisclosures.hasBankAccount : existingProfile.hasBankAccount,
    hasRationCard: newDisclosures.hasRationCard !== undefined ? newDisclosures.hasRationCard : existingProfile.hasRationCard,
    familySize: newDisclosures.familySize !== undefined ? newDisclosures.familySize : existingProfile.familySize,
    landholdingAcres: newDisclosures.landholdingAcres !== undefined ? newDisclosures.landholdingAcres : existingProfile.landholdingAcres
  };
}
