import { db } from "@/firebase/config";
import { ChatItem, MessageItem } from "@/utils/types";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

const chatsCollection = collection(db, "chats");

export const fetchUserChats = async (uid: string): Promise<ChatItem[]> => {
  const chatQuery = query(chatsCollection, where("participants", "array-contains", uid), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(chatQuery as any);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<ChatItem, "id">) }));
};

export const createOrGetChat = async (participantIds: string[], initialMessage?: string): Promise<ChatItem> => {
  const existingQuery = query(chatsCollection, where("participants", "array-contains-any", participantIds));
  const snapshot = await getDocs(existingQuery as any);

  const existingChat = snapshot.docs.find((docSnap) => {
    const data = docSnap.data() as { participants?: unknown };
    const participants = Array.isArray(data.participants) ? (data.participants as string[]) : [];
    return participantIds.every((id) => participants.includes(id)) && participants.length === participantIds.length;
  });

  if (existingChat) {
    return { id: existingChat.id, ...(existingChat.data() as Omit<ChatItem, "id">) };
  }

  const chatData = {
    participants: participantIds,
    lastMessage: initialMessage || "New conversation",
    updatedAt: serverTimestamp(),
    unread: participantIds.reduce<Record<string, number>>((acc, id) => ({ ...acc, [id]: 0 }), {}),
  };
  const chatRef = await addDoc(chatsCollection, chatData as any);
  return { id: chatRef.id, ...(chatData as unknown as Omit<ChatItem, "id">) };
};

export const subscribeToMessages = (chatId: string, callback: (messages: MessageItem[]) => void) => {
  const messagesRef = collection(doc(db, "chats", chatId), "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));
  return onSnapshot(messagesQuery, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<MessageItem, "id">) }))); 
  });
};

export const sendMessage = async (chatId: string, senderId: string, text: string): Promise<void> => {
  const messagesRef = collection(doc(db, "chats", chatId), "messages");
  const message: Omit<MessageItem, "id"> = {
    senderId,
    text,
    createdAt: serverTimestamp() as any,
  };

  await addDoc(messagesRef, message as any);
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text,
    updatedAt: serverTimestamp(),
    [`unread.${senderId}`]: 0,
  });
};

export const getChatDetails = async (chatId: string): Promise<ChatItem | null> => {
  const chatDoc = await getDoc(doc(db, "chats", chatId));
  if (!chatDoc.exists()) {
    return null;
  }
  return { id: chatDoc.id, ...(chatDoc.data() as Omit<ChatItem, "id">) };
};
