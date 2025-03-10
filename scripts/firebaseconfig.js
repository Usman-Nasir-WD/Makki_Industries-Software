// // Configration File

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBa7w_XpfIoWcriPJGs8tEMsr18lf_o7Rc",
    authDomain: "makki-industries.firebaseapp.com",
    projectId: "makki-industries",
    storageBucket: "makki-industries.firebasestorage.app",
    messagingSenderId: "114177000674",
    appId: "1:114177000674:web:6b2ce04c0d76b3d63d8abb",
    measurementId: "G-Y2S86LD1KP"
};


// // Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);