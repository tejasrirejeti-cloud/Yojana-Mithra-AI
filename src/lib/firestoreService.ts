import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';
import { CitizenProfile, GovernmentScheme } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// User Profile Firestore Operations
export async function saveUserProfileToFirestore(userId: string, profile: CitizenProfile, email?: string) {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      uid: userId,
      email: email || '',
      name: profile.name || '',
      state: profile.state || '',
      district: profile.district || '',
      age: profile.age ?? null,
      gender: profile.gender || null,
      annualIncome: profile.annualIncome ?? null,
      occupation: profile.occupation || '',
      education: profile.education || null,
      isFarmer: Boolean(profile.isFarmer),
      isStudent: Boolean(profile.isStudent),
      isWidow: Boolean(profile.isWidow),
      hasDisability: Boolean(profile.hasDisability),
      isMinority: Boolean(profile.isMinority),
      landholdingAcres: profile.landholdingAcres || 0,
      caste: profile.caste || null,
      isBPL: Boolean(profile.isBPL),
      hasAadhaar: Boolean(profile.hasAadhaar),
      hasBankAccount: Boolean(profile.hasBankAccount),
      hasRationCard: Boolean(profile.hasRationCard),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<CitizenProfile | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.deleted) return null;
      return {
        name: data.name || '',
        state: data.state || '',
        district: data.district || '',
        age: data.age ?? undefined,
        gender: data.gender || undefined,
        annualIncome: data.annualIncome ?? undefined,
        occupation: data.occupation || '',
        education: data.education || undefined,
        isFarmer: Boolean(data.isFarmer),
        isStudent: Boolean(data.isStudent),
        isWidow: Boolean(data.isWidow),
        hasDisability: Boolean(data.hasDisability),
        isMinority: Boolean(data.isMinority),
        landholdingAcres: data.landholdingAcres || 0,
        caste: data.caste || undefined,
        isBPL: Boolean(data.isBPL),
        hasAadhaar: Boolean(data.hasAadhaar),
        hasBankAccount: Boolean(data.hasBankAccount),
        hasRationCard: Boolean(data.hasRationCard)
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Saved Schemes Firestore Operations
export interface FirestoreSavedScheme {
  id?: string;
  schemeId: string;
  schemeName: string;
  category: string;
  savedAt: string;
  notes?: string;
  applicationStatus: 'Saved' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected';
}

export async function saveSchemeForUserInFirestore(userId: string, scheme: GovernmentScheme, notes: string = '') {
  const path = `users/${userId}/savedSchemes/${scheme.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedSchemes', scheme.id);
    const payload: FirestoreSavedScheme = {
      schemeId: scheme.id,
      schemeName: scheme.name,
      category: scheme.category,
      savedAt: new Date().toISOString(),
      notes,
      applicationStatus: 'Saved'
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function removeSavedSchemeForUserInFirestore(userId: string, schemeId: string) {
  const path = `users/${userId}/savedSchemes/${schemeId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedSchemes', schemeId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

export async function getSavedSchemesFromFirestore(userId: string): Promise<FirestoreSavedScheme[]> {
  const path = `users/${userId}/savedSchemes`;
  try {
    const colRef = collection(db, 'users', userId, 'savedSchemes');
    const snap = await getDocs(colRef);
    const list: FirestoreSavedScheme[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as FirestoreSavedScheme);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Applications Firestore Operations
export interface FirestoreApplication {
  id?: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  applicationNumber: string;
  appliedDate: string;
  updatedAt: string;
  notes?: string;
}

export async function createApplicationInFirestore(userId: string, schemeId: string, schemeName: string) {
  const path = `users/${userId}/applications`;
  try {
    const colRef = collection(db, 'users', userId, 'applications');
    const appNo = `YM-${Date.now().toString().slice(-6)}`;
    const payload: FirestoreApplication = {
      userId,
      schemeId,
      schemeName,
      status: 'Submitted',
      applicationNumber: appNo,
      appliedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: 'Application submitted via YojanaMitra AI portal.'
    };
    const res = await addDoc(colRef, payload);
    return { id: res.id, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return null;
  }
}

export async function getApplicationsFromFirestore(userId: string): Promise<FirestoreApplication[]> {
  const path = `users/${userId}/applications`;
  try {
    const colRef = collection(db, 'users', userId, 'applications');
    const snap = await getDocs(colRef);
    const list: FirestoreApplication[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as FirestoreApplication);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Chat Messages Firestore Persistence
export async function saveChatMessageToFirestore(userId: string, sender: 'user' | 'assistant', content: string) {
  const path = `users/${userId}/messages`;
  try {
    const colRef = collection(db, 'users', userId, 'messages');
    await addDoc(colRef, {
      userId,
      sender,
      content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getChatHistoryFromFirestore(userId: string, limitCount = 30) {
  const path = `users/${userId}/messages`;
  try {
    const colRef = collection(db, 'users', userId, 'messages');
    const q = query(colRef, orderBy('timestamp', 'asc'), limit(limitCount));
    const snap = await getDocs(q);
    const messages: { sender: 'user' | 'assistant'; content: string; timestamp: string }[] = [];
    snap.forEach(d => {
      const data = d.data();
      messages.push({
        sender: data.sender,
        content: data.content,
        timestamp: data.timestamp
      });
    });
    return messages;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// OCR Scans Firestore Persistence
export async function saveOcrScanToFirestore(userId: string, docType: string, extractedText: string, extractedFields: any) {
  const path = `users/${userId}/ocrScans`;
  try {
    const colRef = collection(db, 'users', userId, 'ocrScans');
    await addDoc(colRef, {
      userId,
      docType,
      extractedText,
      extractedFields,
      scannedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Feedback Operations
export async function submitFeedbackToFirestore(feedbackData: {
  rating: number;
  comments: string;
  category?: string;
  userQuery?: string;
  aiResponseSnippet?: string;
}) {
  const path = `feedback`;
  try {
    const colRef = collection(db, 'feedback');
    await addDoc(colRef, {
      ...feedbackData,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return false;
  }
}
