import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
} from "firebase/firestore";

import firebaseConfig from "../../firebase-applet-config.json";

// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId
);

// Authentication
export const auth = getAuth(app);

// Google Authentication Provider
export const googleProvider = new GoogleAuthProvider();

// ============================================================
// TYPES
// ============================================================

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
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

// ============================================================
// FIRESTORE ERROR HANDLER
// ============================================================

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),

    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
    },

    operationType,
    path,
  };

  console.error(
    "Firestore Error Details:",
    JSON.stringify(errInfo, null, 2)
  );

  return errInfo;
}

// ============================================================
// FIREBASE CONNECTION TEST
// ============================================================

async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(
      doc(db, "test", "connection")
    );

    console.log("Firebase connection verified.");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("client is offline")
    ) {
      console.warn(
        "Firebase client is offline or connection is pending."
      );

      return;
    }

    console.warn(
      "Firebase connection test could not be completed:",
      error
    );
  }
}

// Run connection test
void testConnection();

// ============================================================
// GOOGLE LOGIN
// ============================================================

export const loginWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    return result.user;
  } catch (error: unknown) {
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? String((error as { code?: unknown }).code)
        : undefined;

    // User closed popup
    if (
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request"
    ) {
      return null;
    }

    // Browser blocked popup
    if (
      code === "auth/popup-blocked" ||
      code === "auth/web-storage-unsupported"
    ) {
      await signInWithRedirect(
        auth,
        googleProvider
      );

      return null;
    }

    console.error(
      "Google Sign-In failed:",
      error
    );

    throw error;
  }
};

// ============================================================
// GOOGLE REDIRECT RESULT
// ============================================================

export const resolveGoogleRedirect =
  async (): Promise<User | null> => {
    try {
      const result = await getRedirectResult(auth);

      return result?.user ?? null;
    } catch (error) {
      console.error(
        "Google redirect sign-in failed:",
        error
      );

      throw error;
    }
  };

// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(
      "Sign Out Error:",
      error
    );

    throw error;
  }
};

// ============================================================
// CURRENT USER
// ============================================================

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// ============================================================
// CURRENT USER ID
// ============================================================

export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid ?? null;
};

// ============================================================
// CURRENT USER TOKEN
// ============================================================

export const getCurrentUserToken =
  async (): Promise<string | null> => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return null;
      }

      /*
       * Firebase automatically refreshes the ID token
       * when necessary.
       */
      return await user.getIdToken();
    } catch (error) {
      console.error(
        "Failed to get user ID token:",
        error
      );

      return null;
    }
  };

// ============================================================
// AUTHENTICATION CHECK
// ============================================================

export const isUserAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

// ============================================================
// SAVE / CREATE USER PROFILE
// ============================================================

export const createUserProfile = async (
  user: User
): Promise<void> => {
  try {
    const userRef = doc(
      db,
      "users",
      user.uid
    );

    const existingUser =
      await getDocFromServer(userRef);

    if (existingUser.exists()) {
      return;
    }

    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `users/${user.uid}`
    );

    throw error;
  }
};

// ============================================================
// UPDATE CURRENT USER PROFILE
// ============================================================

export const updateCurrentUserProfile = async (
  data: Record<string, unknown>
): Promise<void> => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        "No authenticated user."
      );
    }

    const userRef = doc(
      db,
      "users",
      user.uid
    );

    await setDoc(
      userRef,
      {
        ...data,
        uid: user.uid,
        updatedAt: new Date().toISOString(),
      },
      {
        merge: true,
      }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      auth.currentUser
        ? `users/${auth.currentUser.uid}`
        : null
    );

    throw error;
  }
};

// ============================================================
// DELETE CURRENT USER ACCOUNT AND DATA
// ============================================================

export const deleteUserAccountAndData =
  async (): Promise<boolean> => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "No authenticated user."
        );
      }

      const uid = user.uid;

      /*
       * IMPORTANT:
       *
       * We intentionally use auth.currentUser.uid.
       *
       * We DO NOT accept a userId from the frontend.
       *
       * This prevents a user from attempting to modify
       * another user's account document.
       */

      const userRef = doc(
        db,
        "users",
        uid
      );

      await setDoc(
        userRef,
        {
          deleted: true,
          deletedAt: new Date().toISOString(),
          name: "[Deleted User]",
          email: "[Deleted]",
          photoURL: "",
        },
        {
          merge: true,
        }
      );

      /*
       * Delete Firebase Authentication account.
       *
       * Firebase may require recent authentication
       * for sensitive operations.
       */
      await user.delete();

      return true;
    } catch (error) {
      console.error(
        "Failed to delete user account:",
        error
      );

      return false;
    }
  };