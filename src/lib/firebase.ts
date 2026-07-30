import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfigJson from "../../firebase.config.json";

// Initialize Firebase
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Pass custom databaseId if defined in firebase.config.json
export const db = getFirestore(
  app,
  firebaseConfigJson.firestoreDatabaseId || "(default)"
);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
};
export type { User };

// Test connection on boot per Firebase guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "jobs", "connection_check"));
  } catch (error: any) {
    if (error?.message?.includes("client is offline")) {
      console.warn("Firestore client is offline or network restricted.");
    }
  }
}

testConnection();
