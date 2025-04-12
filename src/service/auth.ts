import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

interface IAUTH {
  email: string;
  password: string;
  role?: string;
}

class AuthService {
  public async signUp({ email, password, role }: IAUTH) {
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            role: role,
            createdAt: new Date().toISOString(),
          });

          const message =
            "registration Success. Please complete your onboarding";
          const status = "success";

          return {
            message,
            status,
          };
        })
        .catch(() => {
          const status = "failed";
          return {
            status,
          };

          // ..
        });
    } catch (error: any) {
      console.log(error);
      return new Error("Internal Server Error");
    }
  }

  public async signIn({
    email,
    password,
  }: IAUTH): Promise<{ status: "success" | "error"; message: string } | Error> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // You can access user data here if needed
      // const user = userCredential.user;
      const status = "success";
      const message = "Sign-in successful";
      return {
        status,
        message,
      };
    } catch (error: any) {
      console.error("Authentication error:", error?.code);

      // Handle Firebase authentication errors
      let errorMessage = "Sign-in failed. Please try again.";

      switch (error?.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Account temporarily locked";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        case "auth/invalid-credential":
          errorMessage = "Inavalid credentials";
          break;
      }

      return new Error(errorMessage);
    }
  }

  public async signOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(() => {
        // An error happened.
      });
  }
}

export const authService = new AuthService();
