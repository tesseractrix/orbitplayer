import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArSoUN8xIX7Cm-I4oQooyxK0diNjx2RyE",
  authDomain: "orbit-player-2b105.firebaseapp.com",
  projectId: "orbit-player-2b105",
  storageBucket: "orbit-player-2b105.firebasestorage.app",
  messagingSenderId: "1096650827222",
  appId: "1:1096650827222:web:5f812ce1961973d5c47077"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);