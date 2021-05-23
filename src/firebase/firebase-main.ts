/**
 * Initializes the firebase project
 */

import firebase from 'firebase/app';

import { firebaseConfig } from './firebase-config'

/**
 * Call on the Firebase api to initialize the app
 */
export function initializeFirebase() {
    firebase.initializeApp(firebaseConfig);
}