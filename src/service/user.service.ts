import { db } from "./firebase";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  FirestoreError,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}
class UserService {
  public async onboardUser(
    uid: string,
    data: {
      firstName: string;
      lastName: string;
      callNumber: string;
      whatsappNumber: string;
    },
    imageUrl?: string
  ) {
    try {
      const userRef = doc(db, "users", uid);
      const updateData = {
        ...data,
        ...(imageUrl && { profileImage: imageUrl }),
      };

      await setDoc(userRef, updateData, { merge: true });
      return { status: "success", message: "Profile updated successfully" };
    } catch (error: any) {
      let errorMessage = "Profile update failed";

      switch (error.code) {
        case "permission-denied":
          errorMessage = "Database write permission denied";
          break;
        case "not-found":
          errorMessage = "User document not found";
          break;
      }

      return new Error(errorMessage);
    }
  }

  public async updateUserSettings(
    uid: string,
    data: {
      firstName?: string;
      lastName?: string;
      callNumber?: string;
      whatsappNumber?: string;
    }
  ): Promise<void | Error> {
    try {
      if (!uid) return new Error("User not authenticated");
      if (!data || Object.keys(data).length === 0)
        return new Error("No data provided");

      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.callNumber && { callNumber: data.callNumber }),
        ...(data.whatsappNumber && { whatsappNumber: data.whatsappNumber }),
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      let errorMessage = "Failed to update user settings";

      switch (error.code) {
        case "permission-denied":
          errorMessage = "You don't have permission to update these settings";
          break;
        case "not-found":
          errorMessage = "User document not found";
          break;
        case "invalid-argument":
          errorMessage = "Invalid user data format";
          break;
        case "unavailable":
          errorMessage = "Network error occurred";
          break;
      }

      return new Error(errorMessage || error.message);
    }
  }

  public async getOrders(userId: string): Promise<Order[] | Error> {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];
    } catch (error) {
      console.error("Error fetching orders:", error);

      if (error instanceof FirestoreError) {
        switch (error.code) {
          case "permission-denied":
            return new Error("You do not have permission to view orders");
          case "unavailable":
            return new Error(
              "Network error - please check your internet connection"
            );
          default:
            return new Error("Failed to fetch orders");
        }
      }

      return error instanceof Error
        ? error
        : new Error("An unexpected error occurred");
    }
  }
}

export const userService = new UserService();
