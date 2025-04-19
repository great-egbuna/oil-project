import {
  collection,
  query,
  where,
  getDocs,
  FirestoreError,
  updateDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  whatsappNumber: string;
  callNumber: string;
  // Add other user fields as needed
}

class GeneralService {
  public async getDealersOrDistributors(): Promise<User[] | Error> {
    try {
      const usersRef = collection(db, "users");

      // Query users with role 'Dealer' or 'Distributor'
      const q = query(usersRef, where("role", "in", ["Dealer", "Distributor"]));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error) {
      console.error("Error fetching dealers/distributors:", error);

      // Handle specific Firestore errors
      if (error instanceof FirestoreError) {
        switch (error.code) {
          case "permission-denied":
            return new Error("You do not have permission to access this data");
          case "unavailable":
            return new Error(
              "Network error - please check your internet connection"
            );
          default:
            return new Error("Failed to fetch dealers/distributors");
        }
      }

      return error instanceof Error
        ? error
        : new Error("An unexpected error occurred");
    }
  }

  public async updateTaskStatus(
    taskId: string,
    status: string,
    uid: string
  ): Promise<void | Error> {
    const taskRef = doc(db, "tasks", taskId);

    try {
      await updateDoc(taskRef, {
        status,
        updatedAt: serverTimestamp(),
        updatedBy: uid, // Added uid tracking
      });
    } catch (error) {
      console.error("Error updating task status:", error);

      let errorMessage = "Failed to update task status";

      if (error instanceof FirestoreError) {
        switch (error.code) {
          case "permission-denied":
            errorMessage = "You don't have permission to update tasks";
            break;
          case "not-found":
            errorMessage = "Task document not found";
            break;
          case "unavailable":
            errorMessage =
              "Network error - please check your internet connection";
            break;
          case "invalid-argument":
            errorMessage = "Invalid task ID or status value";
            break;
          case "aborted":
            errorMessage = "Update was aborted - please try again";
            break;
          default:
            errorMessage = "Failed to update task status";
        }
      }

      return new Error(errorMessage);
    }
  }
}

export const generalService = new GeneralService();
