import {
  collection,
  addDoc,
  serverTimestamp,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";

interface OrderData {
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  transactionId: string;
  userId: string;
  status?: "pending" | "completed" | "failed";
}
class OrderService {
  public async storeOrder(orderData: OrderData): Promise<string | Error> {
    try {
      const ordersCollection = collection(db, "orders");

      const docRef = await addDoc(ordersCollection, {
        ...orderData,
        status: orderData.status || "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error storing order:", error);

      if (error instanceof FirestoreError) {
        switch (error.code) {
          case "permission-denied":
            return new Error("You do not have permission to create orders");
          case "unavailable":
            return new Error(
              "Network error - please check your internet connection"
            );
          case "resource-exhausted":
            return new Error("Too many requests - please try again later");
          default:
            return new Error("Failed to save order");
        }
      }

      return error instanceof Error
        ? error
        : new Error("An unexpected error occurred");
    }
  }
}
export const orderService = new OrderService();
