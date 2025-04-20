import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

interface Message {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  senderId: string;
  receiverId: string;
}

class MessageService {
  async getUserMessages(uid: string): Promise<Message[]> {
    try {
      const db = getFirestore();
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("receiverId", "==", uid),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          message: data.message,
          timestamp: data.timestamp,
          read: data.read,
          senderId: data.senderId,
          receiverId: data.receiverId,
        } as Message;
      });
    } catch (error) {
      console.log("error", error);

      throw new Error("Failed to fetch messages");
    }
  }

  async markMessageAsRead(messageId: string) {
    try {
      const db = getFirestore();
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, { read: true });
    } catch (error) {
      throw new Error("Failed to mark message as read");
    }
  }
}

export const messageService = new MessageService();
