// src/auth.ts

import { auth, googleProvider } from './firebase';
import {
  signOut,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';



// Google Sign-In Function
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign Out Function
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out.');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
