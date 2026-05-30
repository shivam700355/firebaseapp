import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbFX-vWiO1clRM0sP6So2WFca-vOs46lM",
  authDomain: "test-app-3a733.firebaseapp.com",
  projectId: "test-app-3a733",
  storageBucket: "test-app-3a733.firebasestorage.app",
  messagingSenderId: "830722211929",
  appId: "1:830722211929:web:2e17cc65ac99512eb67148",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);