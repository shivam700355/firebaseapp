import { db, storage } from "@/firebase/config";
import { UserProfile } from "@/utils/types";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const usersCollection = collection(db, "users");

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    return null;
  }

  return {
    uid,
    ...(userDoc.data() as Omit<UserProfile, "uid">),
  };
};

export const fetchUsers = async (searchTerm = ""): Promise<UserProfile[]> => {
  const baseQuery = searchTerm
    ? query(usersCollection, where("name", ">=", searchTerm), where("name", "<=", `${searchTerm}\uf8ff`))
    : query(usersCollection);

  const snapshot = await getDocs(baseQuery);
  return snapshot.docs.map((docSnap) => ({ uid: docSnap.id, ...(docSnap.data() as Omit<UserProfile, "uid">) }));
};

export const updateProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  await updateDoc(doc(db, "users", uid), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const uploadProfileImage = async (uid: string, uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const imageRef = ref(storage, `profiles/${uid}/${Date.now()}`);
  await uploadBytes(imageRef, blob);
  return getDownloadURL(imageRef);
};

export const setUserStatus = async (uid: string, status: "online" | "offline"): Promise<void> => {
  await updateDoc(doc(db, "users", uid), {
    status,
    lastSeen: new Date().toISOString(),
  });
};
