// ============================================
// FIREBASE CONFIGURATION
// ============================================

// STEP 1: Replace this with YOUR Firebase config
// Get it from: Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
    apiKey: "AIzaSyBx7O-Eh-YIHWTTDvx1KCXDTNqX37n-grA",
    authDomain: "student-teacher-booking-311f5.firebaseapp.com",
    projectId: "student-teacher-booking-311f5",
    storageBucket: "student-teacher-booking-311f5.firebasestorage.app",
    messagingSenderId: "1041844488228",
    appId: "1:1041844488228:web:6f1d8d262e577222f170b1",
    measurementId: "G-0RH90CLCTQ"
};

// 👉 STEP 2: Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 👉 STEP 3: Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// 👉 STEP 4: Make them available globally
window.auth = auth;
window.db = db;

console.log("✅ Firebase initialized successfully!");