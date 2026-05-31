import { auth, db } from "@/firebase/config";
import { setUserStatus } from "@/services/userService";
import { UserProfile } from "@/utils/types";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string = "user"
): Promise<UserProfile> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  const profile: UserProfile = {
    uid: credential.user.uid,
    name,
    email,
    role,
    status: "online",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", credential.user.uid), profile);
  return profile;
};

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userRef = doc(db, "users", credential.user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("User profile not found.");
  }

  return {
    uid: credential.user.uid,
    ...snapshot.data(),
  } as UserProfile;
};

export const logoutUser = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await setUserStatus(currentUser.uid, "offline");
    }
  } catch (error) {
    console.warn("Failed to update status before logout", error);
  }

  await signOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
