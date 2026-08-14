import { GoogleGenAI } from '@google/genai';
import { SCHEMES_DATABASE } from '../data/schemes.js';
import { GovernmentScheme, CitizenProfile, RagCitation } from '../types.js';

export interface SchemeChunk {
  chunkId: string;
  schemeId: string;
  schemeName: string;
  ministry: string;
  section: 'Overview & Benefits' | 'Eligibility Rules' | 'Application Process' | 'Documents & Contact';
  content: string;
  tags: string[];
  officialWebsite: string;
  helpline: string;
  isFarmerOnly?: boolean;
  isBPLOnly?: boolean;
  isStudentOnly?: boolean;
  requiredOccupations?: string[];
  maxIncomeINR?: number;
  vectorEmbedding?: number[];
}

export interface RagSearchResult {
  chunk: SchemeChunk;
  scheme: GovernmentScheme;
  score: number;
  relevanceScore: number;
  eligibilityScore: number;
}

// 1. CHUNKING THE KNOWLEDGE BASE
export function buildSchemeKnowledgeBase(): SchemeChunk[] {
  const chunks: SchemeChunk[] = [];

  for (const scheme of SCHEMES_DATABASE) {
    // Chunk 1: Overview & Benefits
    chunks.push({
      chunkId: `${scheme.id}-overview`,
      schemeId: scheme.id,
      schemeName: scheme.name,
      ministry: scheme.ministry,
      section: 'Overview & Benefits',
      content: `Scheme: ${scheme.name} (${scheme.hindiName || ''}). Ministry: ${scheme.ministry}. Category: ${scheme.category}. Description: ${scheme.description}. Short Description: ${scheme.shortDescription}. Financial Benefits: ${scheme.benefits}. Max Benefit INR: ${scheme.maxBenefitValueINR || 'N/A'}.`,
      tags: scheme.tags,
      officialWebsite: scheme.officialWebsite,
      helpline: scheme.helpline,
      isFarmerOnly: scheme.eligibilityCriteria.isFarmerOnly,
      isBPLOnly: scheme.eligibilityCriteria.isBPLOnly,
      isStudentOnly: scheme.eligibilityCriteria.isStudentOnly,
      requiredOccupations: scheme.eligibilityCriteria.requiredOccupations,
      maxIncomeINR: scheme.eligibilityCriteria.maxIncomeINR
    });

    // Chunk 2: Eligibility Rules & Exclusions
    chunks.push({
      chunkId: `${scheme.id}-eligibility`,
      schemeId: scheme.id,
      schemeName: scheme.name,
      ministry: scheme.ministry,
      section: 'Eligibility Rules',
      content: `Eligibility Criteria for ${scheme.name}: Min Age: ${scheme.eligibilityCriteria.minAge || 'Any'}, Max Age: ${scheme.eligibilityCriteria.maxAge || 'Any'}, Max Income: ₹${scheme.eligibilityCriteria.maxIncomeINR || 'No Limit'}, Farmer Only: ${scheme.eligibilityCriteria.isFarmerOnly ? 'YES' : 'NO'}, BPL Only: ${scheme.eligibilityCriteria.isBPLOnly ? 'YES' : 'NO'}, Student Only: ${scheme.eligibilityCriteria.isStudentOnly ? 'YES' : 'NO'}, Max Landholding: ${scheme.eligibilityCriteria.maxLandAcres ? `${scheme.eligibilityCriteria.maxLandAcres} acres` : 'Any'}. Exclusions: Government employees and taxpayers excluded from agricultural direct transfers.`,
      tags: scheme.tags,
      officialWebsite: scheme.officialWebsite,
      helpline: scheme.helpline,
      isFarmerOnly: scheme.eligibilityCriteria.isFarmerOnly,
      isBPLOnly: scheme.eligibilityCriteria.isBPLOnly,
      isStudentOnly: scheme.eligibilityCriteria.isStudentOnly,
      requiredOccupations: scheme.eligibilityCriteria.requiredOccupations,
      maxIncomeINR: scheme.eligibilityCriteria.maxIncomeINR
    });

    // Chunk 3: Application Process & Required Documents
    chunks.push({
      chunkId: `${scheme.id}-application`,
      schemeId: scheme.id,
      schemeName: scheme.name,
      ministry: scheme.ministry,
      section: 'Application Process',
      content: `Application Process for ${scheme.name}: Steps: ${scheme.applicationProcess.join(' ')} Required Documents: ${scheme.requiredDocuments.join(', ')}. Official Portal: ${scheme.officialWebsite}. Helpline: ${scheme.helpline}.`,
      tags: scheme.tags,
      officialWebsite: scheme.officialWebsite,
      helpline: scheme.helpline,
      isFarmerOnly: scheme.eligibilityCriteria.isFarmerOnly,
      isBPLOnly: scheme.eligibilityCriteria.isBPLOnly,
      isStudentOnly: scheme.eligibilityCriteria.isStudentOnly,
      requiredOccupations: scheme.eligibilityCriteria.requiredOccupations,
      maxIncomeINR: scheme.eligibilityCriteria.maxIncomeINR
    });
  }

  return chunks;
}

const KNOWLEDGE_BASE_CHUNKS = buildSchemeKnowledgeBase();

// 2. VECTOR SIMILARITY & TF-IDF LEXICAL SEARCH
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function computeCosineSim(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Simple deterministic term vector builder for hybrid fallback
function buildTermVector(tokens: string[], vocab: string[]): number[] {
  return vocab.map(term => tokens.filter(t => t === term).length);
}

// 3. HYBRID SEARCH ENGINE
export function searchKnowledgeBase(query: string, profile: CitizenProfile, topK = 5): RagSearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  // Build vocabulary for term similarity
  const vocabSet = new Set<string>(queryTokens);
  KNOWLEDGE_BASE_CHUNKS.forEach(c => tokenize(c.content).forEach(t => vocabSet.add(t)));
  const vocab = Array.from(vocabSet).slice(0, 500);

  const queryVec = buildTermVector(queryTokens, vocab);

  const results: RagSearchResult[] = [];

  for (const chunk of KNOWLEDGE_BASE_CHUNKS) {
    const chunkTokens = tokenize(chunk.content);
    const chunkVec = buildTermVector(chunkTokens, vocab);

    // Vector Similarity Score
    const vectorSim = computeCosineSim(queryVec, chunkVec);

    // Lexical / Tag Match Score
    let tagMatchCount = 0;
    for (const tag of chunk.tags) {
      if (queryTokens.includes(tag.toLowerCase())) {
        tagMatchCount++;
      }
    }
    const lexicalScore = (tagMatchCount * 0.3) + (chunkTokens.filter(t => queryTokens.includes(t)).length / Math.max(queryTokens.length, 1)) * 0.7;

    // Hybrid Relevance Score
    const relevanceScore = Math.min(1.0, (vectorSim * 0.5) + (lexicalScore * 0.5));

    // Profile Constraints & Eligibility Penalty
    let eligibilityScore = 1.0;
    const occLower = (profile.occupation || '').toLowerCase();
    const isStudentProfile = Boolean(profile.isStudent) || occLower.includes('student') || occLower.includes('pupil') || occLower.includes('scholar') || occLower.includes('study') || occLower.includes('college') || occLower.includes('school');
    const isFarmerProfile = (Boolean(profile.isFarmer) || occLower.includes('farmer') || occLower.includes('agri') || occLower.includes('cultivat') || occLower.includes('rythu') || occLower.includes('kisan')) && !isStudentProfile;

    if (chunk.isFarmerOnly && !isFarmerProfile) {
      eligibilityScore = 0.0; // Hard exclusion for non-farmers
    }
    if (chunk.isStudentOnly && !isStudentProfile) {
      eligibilityScore = 0.0; // Hard exclusion for non-students
    }
    if (chunk.requiredOccupations && chunk.requiredOccupations.length > 0 && profile.occupation) {
      const match = chunk.requiredOccupations.some(req => 
        occLower.includes(req.toLowerCase()) || req.toLowerCase().includes(occLower)
      );
      if (!match) {
        eligibilityScore = 0.0; // Hard exclusion for incompatible required occupations
      }
    }
    if (chunk.isBPLOnly && profile.isBPL === false) {
      eligibilityScore *= 0.4;
    }
    if (chunk.maxIncomeINR && profile.annualIncome && profile.annualIncome > chunk.maxIncomeINR) {
      eligibilityScore *= 0.3;
    }

    const combinedScore = relevanceScore * eligibilityScore;

    if (combinedScore > 0.05) {
      const scheme = SCHEMES_DATABASE.find(s => s.id === chunk.schemeId)!;
      results.push({
        chunk,
        scheme,
        score: Math.round(combinedScore * 100),
        relevanceScore: Math.round(relevanceScore * 100),
        eligibilityScore: Math.round(eligibilityScore * 100)
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

// 4. FULL RAG PIPELINE EXECUTOR WITH AI MEMORY SYSTEM
export async function executeRagPipeline(
  aiClient: GoogleGenAI,
  userMessage: string,
  profile: CitizenProfile,
  language: string = 'en',
  memoryContext?: {
    conversationSummary?: string;
    relevantPastMemory?: Array<{ query: string; aiResponse: string }>;
  }
) {
  // Step 1: Hybrid Retrieval
  const searchResults = searchKnowledgeBase(userMessage, profile, 6);

  // Check if query is totally out-of-scope or no information is available
  const topScore = searchResults.length > 0 ? searchResults[0].score : 0;
  const noInformationFound = searchResults.length === 0 || topScore < 15;

  // Confidence Score Calculation
  const confidenceScore = noInformationFound ? 0 : Math.min(98, Math.max(65, topScore + 10));

  // Step 2: Build Citations & Context
  const citations: RagCitation[] = searchResults.slice(0, 4).map(res => ({
    schemeId: res.scheme.id,
    schemeName: res.scheme.name,
    ministry: res.scheme.ministry,
    section: res.chunk.section,
    relevantExcerpt: res.chunk.content.slice(0, 200) + '...',
    officialWebsite: res.scheme.officialWebsite,
    helpline: res.scheme.helpline,
    confidenceScore: res.score
  }));

  const sources: GovernmentScheme[] = Array.from(
    new Map(searchResults.map(r => [r.scheme.id, r.scheme])).values()
  );

  const retrievedContextText = searchResults
    .map((res, idx) => `[Source ${idx + 1}: ${res.scheme.name} | Section: ${res.chunk.section}]\n${res.chunk.content}`)
    .join('\n\n');

  const memoryContextText = memoryContext?.conversationSummary 
    ? `LONG-TERM CONVERSATION MEMORY: ${memoryContext.conversationSummary}`
    : '';

  const pastRecallsText = memoryContext?.relevantPastMemory && memoryContext.relevantPastMemory.length > 0
    ? `RECALLED RELEVANT PAST INTERACTION MEMORY:\n${memoryContext.relevantPastMemory.map(m => `- User previously asked: "${m.query}" -> Assistant answered: "${m.aiResponse.slice(0, 150)}..."`).join('\n')}`
    : '';

  // Step 3: Prompt Construction with STRICT Hallucination Defense & Memory System
  const systemPrompt = `You are YojanaMitra AI, an authoritative, empathetic government scheme AI assistant.
You operate on a strict Retrieval-Augmented Generation (RAG) framework with a persistent AI Memory System.

USER QUERY: "${userMessage}"
CITIZEN PROFILE (PERSISTENT MEMORY - DO NOT RE-ASK FOR KNOWN PROFILE DETAILS):
${JSON.stringify(profile, null, 2)}
PREFERRED LANGUAGE: ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}

${memoryContextText}
${pastRecallsText}

RETRIEVED KNOWLEDGE BASE CONTEXT:
${noInformationFound ? "NO RELEVANT GOVERNMENT SCHEME DOCUMENTS FOUND IN KNOWLEDGE BASE." : retrievedContextText}

STRICT RAG & MEMORY RULES:
1. You MUST answer ONLY using the RETRIEVED KNOWLEDGE BASE CONTEXT and PERSISTENT MEMORY provided above.
2. DO NOT ask the user for information already present in their profile (e.g. Age, Income, Occupation, State) unless they explicitly request to edit/change it.
3. NEVER invent, hallucinate, or assume schemes, monetary benefits, eligibility numbers, or rules that are not explicitly present in the retrieved context.
4. If no relevant scheme context exists or the question is completely unrelated to Indian government schemes, set "noInformationFound": true and clearly inform the user that no matching official government scheme was found in our knowledge base.
5. Extract any newly disclosed profile parameters from user message (e.g., occupation, state, age, income) in "extractedProfile".
6. Cite exact schemes and numbers from the context. Explain clearly why they qualify or why they are excluded (e.g. non-farmers excluded from PM-KISAN).

Respond strictly in valid JSON with this exact schema:
{
  "replyText": "Detailed, empathetic response in requested language incorporating facts from retrieved sources...",
  "noInformationFound": ${noInformationFound},
  "extractedProfile": {
    "state": "...",
    "age": 30,
    "occupation": "...",
    "isFarmer": false
  }
}`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json'
      }
    });

    let replyText = '';
    let extractedProfile: Partial<CitizenProfile> = {};
    let isNoInfo = noInformationFound;

    try {
      const parsed = JSON.parse(response.text || '{}');
      replyText = parsed.replyText || '';
      extractedProfile = parsed.extractedProfile || {};
      if (typeof parsed.noInformationFound === 'boolean') {
        isNoInfo = parsed.noInformationFound;
      }
    } catch {
      replyText = response.text || 'Information extracted from government knowledge base.';
    }

    if (isNoInfo) {
      replyText = `We could not find any matching official government scheme in our verified knowledge base corresponding to your query "${userMessage}". Please search for verified schemes like PM-KISAN, Ayushman Bharat, PMAY Housing, PM MUDRA, or Atal Pension Yojana.`;
    }

    return {
      replyText,
      extractedProfile,
      citations: isNoInfo ? [] : citations,
      sources: isNoInfo ? [] : sources,
      confidenceScore: isNoInfo ? 0 : confidenceScore,
      noInformationFound: isNoInfo
    };
  } catch (error) {
    console.error('RAG Generation Error:', error);
    return {
      replyText: `Based on retrieved government knowledge sources, here are the top matching verified schemes for your profile.`,
      extractedProfile: {},
      citations: citations,
      sources: sources,
      confidenceScore: confidenceScore,
      noInformationFound: false
    };
  }
}
