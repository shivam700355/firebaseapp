export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSeen?: string;
}

import type { FieldValue, Timestamp } from "firebase/firestore";

export interface MessageItem {
  id?: string;
  senderId: string;
  text: string;
  createdAt: string | { seconds: number; nanoseconds: number } | Timestamp | FieldValue;
}

export interface ChatItem {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: string | { seconds: number; nanoseconds: number } | Timestamp | FieldValue;
  unread?: Record<string, number>;
}
