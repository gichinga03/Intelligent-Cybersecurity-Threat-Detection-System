"use client";
// 
//  lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtmeEIuo06qwDimUjTpcIXmW8Te49PC9o",
  authDomain: "sentinelx-67bf8.firebaseapp.com",
  projectId: "sentinelx-67bf8",
  storageBucket: "sentinelx-67bf8.appspot.com",
  messagingSenderId: "933748173774",
  appId: "1:933748173774:web:fae653b8958176ca28199f",
  measurementId: "G-YGCVW3MH6H",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
