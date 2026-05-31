import { MessageItem } from "@/utils/types";
import type { FieldValue, Timestamp } from "firebase/firestore";

export const formatTimestamp = (timestamp?: string | { seconds: number; nanoseconds: number } | Timestamp | FieldValue): string => {
  if (!timestamp) {
    return "";
  }

  if (typeof timestamp === "string") {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (typeof timestamp === "object" && "toDate" in timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (typeof timestamp === "object" && "seconds" in timestamp && "nanoseconds" in timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "";
};

export const createMessagePreview = (message?: MessageItem) => {
  if (!message) return "No message yet";
  return `${message.text.slice(0, 40)}${message.text.length > 40 ? "..." : ""}`;
};
