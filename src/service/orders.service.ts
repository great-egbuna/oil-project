import {
  collection,
  addDoc,
  serverTimestamp,
  FirestoreError,
  getDocs,
  updateDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import { ImageItem } from "./admin.service";

export interface OrderData {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  transactionId: string;
  userId: string;
  status?: "pending" | "completed" | "failed";
  userName?: string;
  profileImage?: string;
  bal?: number;
  callNumber?: string;
  whatsappNumber?: string;
  email?: string;
  createdAt?: string;
}
class OrderService {
  handleOrderServiceError(error: unknown) {
    if (error instanceof FirestoreError) {
      switch (error.code) {
        case "permission-denied":
          return "You do not have permission to perform this action";
        case "not-found":
          return "Order document not found";
        case "invalid-argument":
          return "Invalid order ID format";
        case "unavailable":
          return "Network error - please check your internet connection";
        case "aborted":
          return "Operation aborted - please try again";
        default:
          return "Database operation failed";
      }
    }
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
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

  public async getAllOrders() {
    try {
      const q = query(collection(db, "orders"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;
    } catch (error) {
      const message = this.handleOrderServiceError(error);
      console.error("Failed to fetch orders:", error);
      throw new Error(message);
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      const message = this.handleOrderServiceError(error);
      console.error("Order status update failed:", error);
      return new Error(message);
    }
  }

  async updateOrderBalance(orderId: string, newBalance: number) {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        bal: newBalance,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      const message = this.handleOrderServiceError(error);
      console.error("Balance update failed:", error);
      return new Error(message);
    }
  }

 
}
export const orderService = new OrderService();
