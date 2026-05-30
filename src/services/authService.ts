import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string = "user"
) => {
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const createdAt = new Date().toISOString();

  const profile = {
    uid: credential.user.uid,
    name,
    email,
    role,
    createdAt,
  };

  await setDoc(doc(db, "users", credential.user.uid), profile);

  return profile;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const userRef = doc(
    db,
    "users",
    credential.user.uid
  );

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error(
      "User profile not found"
    );
  }

  return {
    uid: credential.user.uid,
    ...snapshot.data(),
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};