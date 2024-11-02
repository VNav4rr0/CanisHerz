import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwC1m0YVGMJby97kgtUf6gNZAy2g5XiD0",
  authDomain: "canisherz-90112.firebaseapp.com",
  projectId: "canisherz-90112",
  storageBucket: "canisherz-90112.appspot.com",
  messagingSenderId: "371181649391",
  appId: "1:371181649391:web:c9c25707c9d60e0ebd8a1a",
  measurementId: "G-6THBGHLDE1"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


// Export authentication and Firestore services
const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
