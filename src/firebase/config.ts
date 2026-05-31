import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBbFX-vWiO1clRM0sP6So2WFca-vOs46lM",
  authDomain: "test-app-3a733.firebaseapp.com",
  projectId: "test-app-3a733",
  storageBucket: "test-app-3a733.appspot.com",
  messagingSenderId: "830722211929",
  appId: "1:830722211929:web:2e17cc65ac99512eb67148",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
