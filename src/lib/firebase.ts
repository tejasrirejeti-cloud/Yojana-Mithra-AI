import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  getDocFromServer,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId as specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  return errInfo;
}

// Validate Connection on startup as required by skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or pending config.');
    }
  }
}
testConnection();

// Authentication Helper
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.info('User closed the Google Sign-in popup.');
      return null;
    }
    if (error.code === 'auth/cancelled-popup-request') {
      console.info('Sign-in popup request cancelled.');
      return null;
    }
    if (error.code === 'auth/popup-blocked') {
      console.warn('Popup was blocked by the browser. Please allow popups for this site.');
      throw new Error('Sign-in popup blocked by browser. Please enable popups.');
    }
    console.error('Google Auth Error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
};

export const getCurrentUserToken = async (): Promise<string | null> => {
  try {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  } catch (err) {
    console.error('Failed to get user ID token:', err);
    return null;
  }
};

// GDPR-compliant account and personal data wipe
export const deleteUserAccountAndData = async (userId: string): Promise<boolean> => {
  try {
    // Delete user profile doc
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      deleted: true,
      deletedAt: new Date().toISOString(),
      name: '[Deleted User]',
      email: '[Deleted]'
    });

    if (auth.currentUser && auth.currentUser.uid === userId) {
      await auth.currentUser.delete();
    }
    return true;
  } catch (err) {
    console.error('Failed to delete user account:', err);
    return false;
  }
};
