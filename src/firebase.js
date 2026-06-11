import { initializeApp } from "firebase/app";
import {initializeFirestore, persistentLocalCache, persistentMultipleTabManager,} from "firebase/firestore";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

//Set up the authenticator based on the example from stackblitz and then adjusted to fit our needs

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, db, auth, provider };