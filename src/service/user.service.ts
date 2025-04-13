import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

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
}

export const userService = new UserService();
