import config from "./firebase-config.js";
import { initializeApp } from "firebase/app";
// https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};

// Inicializando o Firebase
export const app = initializeApp(firebaseConfig);
