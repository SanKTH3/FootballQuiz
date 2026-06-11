import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

//Handles Google sign in, Presenters should call this instead of Firebase directly
export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

//Handles logout, Presenters should call this instead of Firebase directly
export function logoutUser() {
  return signOut(auth);
}