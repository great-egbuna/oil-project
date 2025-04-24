export interface Task {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  task: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface User {
  uid: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  status?: string;
  // ... other user fields
}

export interface Product {
  id: string;
  productImage: string;
  price: number;
  type: string;
  litre: string;
  description: string;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  name?: string;
}

interface DashboardStats {
  dealerCount: number;
  distributorCount: number;
  staffCount: number;
  othersCount: number;
  orderCount: number;
  productCount: number;
}

export interface ImageItem {
  id: string;
  url: string;
  createdAt: Date;
}

import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  addDoc,
  serverTimestamp,
  deleteDoc,
  getDoc,
  FirestoreError,
  getCountFromServer,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { OrderData } from "./orders.service";

class AdminService {
  public async addUser(
    email: string,
    password: string,
    formData: Record<string, any>
  ): Promise<{ uid: string } | Error> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Prepare user data
      const userData = {
        ...formData,
        email,
        uid: userCredential.user.uid,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      };

      // Create firestore document
      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      return { uid: userCredential.user.uid };
    } catch (error: any) {
      let errorMessage = "Staff creation failed";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "permission-denied":
          errorMessage = "Missing staff creation permissions";
          break;
        case "unavailable":
          errorMessage = "Network error occurred";
          break;
      }

      return new Error(errorMessage);
    }
  }

  public async getAllStaff(): Promise<
    Array<{ id: string; [key: string]: any }> | Error
  > {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("role", "==", "Staff"));
      const querySnapshot = await getDocs(q);

      const staffMembers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return staffMembers;
    } catch (error: any) {
      let errorMessage = "Failed to fetch staff members";

      switch (error.code) {
        case "permission-denied":
          errorMessage = "You don't have permission to view staff";
          break;
        case "unavailable":
          errorMessage = "Network error occurred";
          break;
      }

      return new Error(errorMessage || error.message);
    }
  }

  public async addTask(taskData: {
    uid: string;
    firstName: string;
    lastName: string;
    task: string;
    description: string;
  }) {
    try {
      const tasksCollection = collection(db, "tasks");

      const newTask = {
        ...taskData,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(tasksCollection, newTask);
      return docRef.id;
    } catch (error) {
      console.error("Error adding task:", error);
      return new Error("Failed to create task");
    }
  }

  public async getStaffTask(uid: string): Promise<Task[] | Error> {
    try {
      const tasksCollection = collection(db, "tasks");
      const q = query(tasksCollection, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to JS Date objects
        createdAt: doc.data().createdAt?.toDate() || null,
        updatedAt: doc.data().updatedAt?.toDate() || null,
      })) as Task[];
    } catch (error) {
      console.error("Error fetching staff tasks:", error);
      return new Error("Failed to fetch tasks. Please try again later.");
    }
  }

  public async deleteTask(taskId: string, uid: string): Promise<void | Error> {
    try {
      const taskRef = doc(db, "tasks", taskId);
      const taskSnapshot = await getDoc(taskRef);

      if (!taskSnapshot.exists()) {
        return new Error("Task not found");
      }

      const taskData = taskSnapshot.data();

      if (taskData?.uid !== uid) {
        return new Error("Unauthorized: This task does not belong to the user");
      }

      await deleteDoc(taskRef);
      return;
    } catch (error) {
      console.error("Error deleting task:", error);
      return error instanceof Error
        ? error
        : new Error("Failed to delete task");
    }
  }

  public async deleteStaff(uid: string): Promise<Error | null> {
    try {
      // Delete from Firestore users collection
      const userDocRef = doc(db, "users", uid);
      await deleteDoc(userDocRef);

      return null;
    } catch (error) {
      console.error("Error deleting staff:", error);
      return error instanceof Error
        ? error
        : new Error("Failed to delete staff");
    }
  }

  public async getAllUsers(): Promise<User[] | Error> {
    try {
      const usersRef = collection(db, "users");

      // Query users without admin/staff roles
      const q = query(usersRef, where("role", "not-in", ["admin", "Staff"]));

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error) {
      console.error("Error fetching users:", error);
      return error instanceof Error
        ? error
        : new Error("Failed to fetch users");
    }
  }

  public async createProduct(productData: {
    productImage: string;
    price: number;
    type: string;
    litre: string;
    description: string;
    discount: number;
  }): Promise<string | Error> {
    try {
      const productsCollection = collection(db, "products");

      const docRef = await addDoc(productsCollection, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
      });

      return docRef.id;
    } catch (error) {
      console.error("Firestore Error:", error);

      // Handle specific Firestore error codes
      if (error instanceof FirestoreError) {
        switch (error.code) {
          case "permission-denied":
            return new Error("You do not have permission to create products");
          case "unavailable":
            return new Error(
              "Network error - please check your internet connection"
            );
          case "invalid-argument":
            return new Error("Invalid product data - please check your inputs");
          case "resource-exhausted":
            return new Error("Server overloaded - please try again later");
          case "aborted":
            return new Error("Operation aborted - please try again");
          case "failed-precondition":
            return new Error("Operation not allowed in current state");
          default:
            return new Error("Failed to create product - please try again");
        }
      }

      // Handle generic errors
      return error instanceof Error
        ? error
        : new Error("An unexpected error occurred");
    }
  }

  public async getAllProducts(): Promise<Product[] | Error> {
    try {
      const productsCollection = collection(db, "products");
      const snapshot = await getDocs(productsCollection);

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];
    } catch (error) {
      console.error("Firestore Error:", error);

      // Handle specific Firestore errors
      if (error instanceof FirestoreError) {
        switch (error.code) {
          case "permission-denied":
            return new Error("You do not have permission to view products");
          case "unavailable":
            return new Error(
              "Network error - please check your internet connection"
            );
          case "invalid-argument":
            return new Error("Invalid query parameters");
          case "resource-exhausted":
            return new Error("Server overloaded - please try again later");
          case "aborted":
            return new Error("Operation aborted - please try again");
          case "failed-precondition":
            return new Error("Data conflict - please refresh and try again");
          case "internal":
            return new Error("Server error - please contact support");
          default:
            return new Error("Failed to fetch products");
        }
      }

      // Handle generic errors
      return error instanceof Error
        ? error
        : new Error("An unexpected error occurred");
    }
  }

  public async deleteProduct(productId: string): Promise<true | Error> {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);

      // Handle specific Firestore errors
      if (error instanceof FirestoreError) {
        switch (error.code) {
          case "permission-denied":
            return new Error("You do not have permission to delete products");
          case "not-found":
            return new Error("Product does not exist");
          case "unavailable":
            return new Error(
              "Network error - please check your internet connection"
            );
          case "resource-exhausted":
            return new Error("Too many requests - please try again later");
          default:
            return new Error("Failed to delete product");
        }
      }

      // Handle generic errors
      return error instanceof Error
        ? error
        : new Error("An unexpected error occurred");
    }
  }

  public async getDashboardStats(): Promise<DashboardStats> {
    try {
      // User role counts
      const [
        dealerCount,
        distributorCount,
        staffCount,
        totalUsers,
        orderCount,
        productCount,
      ] = await Promise.all([
        this.getRoleCount("Dealer"),
        this.getRoleCount("Distributor"),
        this.getRoleCount("Staff"),
        this.getTotalUsersCount(),
        this.getCollectionCount("orders"),
        this.getCollectionCount("products"),
      ]);

      // Calculate others count
      const othersCount =
        totalUsers - (dealerCount + distributorCount + staffCount);

      return {
        dealerCount,
        distributorCount,
        staffCount,
        othersCount,
        orderCount,
        productCount,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics");
    }
  }

  private async getRoleCount(role: string): Promise<number> {
    const q = query(collection(db, "users"), where("role", "==", role));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  private async getTotalUsersCount(): Promise<number> {
    const q = query(collection(db, "users"));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  private async getCollectionCount(collectionName: string): Promise<number> {
    const q = query(collection(db, collectionName));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  async updateUserStatus(uid: string, status: string) {
    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        status: status,
        updatedAt: new Date().toISOString(),
      });

      return "User status updated successfully";
    } catch (error) {
      return new Error(
        error instanceof Error ? error.message : "Failed to update user status"
      );
    }
  }

  async getConfirmedOrders(): Promise<OrderData[] | Error> {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("status", "==", "confirmed"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as any;
    } catch (error) {
      console.log("error", error);
      return new Error("Failed to fetch confirmed orders");
    }
  }

  async sendMessage(receiverId: string, message: string, senderId: string) {
    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        receiverId,
        senderId,
        message,
        timestamp: new Date().toISOString(),
        read: false,
      });
      return true;
    } catch (error) {
      return new Error("Failed to send message");
    }
  }

  async uploadImage(url: string, description: string) {
    try {
      const docRef = await addDoc(collection(db, "images"), {
        url,
        description,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error uploading image:", error);
      return new Error("Failed to upload image");
    }
  }

  async getImages(): Promise<ImageItem[]> {
    try {
      const snapshot = await getDocs(collection(db, "images"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        url: doc.data().url,
        description: doc.data().description || "",
        createdAt: doc.data(),
      })) as any;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  }

  async deleteImage(id: string) {
    try {
      await deleteDoc(doc(db, "images", id));
    } catch (error) {
      return new Error("Failed to delete image");
    }
  }

  async updateProduct(productId: string, data: Partial<Product>) {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, data);
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  // In admin.service.ts
  async getLandingDescription(): Promise<any | null> {
    try {
      const docRef = doc(db, "description", "content");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          description: docSnap.data().description,
          createdAt: docSnap.data().createdAt,
          updatedAt: docSnap.data().updatedAt,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting landing description:", error);
      return null;
    }
  }

  async saveLandingDescription(description: string): Promise<void> {
    try {
      const docRef = doc(db, "description", "content");
      await setDoc(
        docRef,
        {
          description,
          updatedAt: new Date().toISOString(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving landing description:", error);
      throw new Error("Failed to save description");
    }
  }

  async saveBlog(data: { url: string; description: string }) {
    try {
      const docRef = await addDoc(collection(db, "blog"), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving image:", error);
      throw new Error("Failed to save image");
    }
  }

  async getAllBlogs(): Promise<any[]> {
    try {
      const q = query(collection(db, "blog"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt,
      })) as any;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  }

  async getBlogById(id: string): Promise<any> {
    try {
      const docRef = doc(db, "blog", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt,
          }
        : null;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  }
}

export const adminService = new AdminService();
