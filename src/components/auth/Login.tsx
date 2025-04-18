"use client";

import { useState } from "react";
import { authService } from "@/service/auth";
import { ButtonLoader } from "../ui/Loader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  onSwitchForm: () => void;
}

export const Login = ({ onSwitchForm }: AuthFormProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const res = await authService.signIn({ email, password });

    if (res instanceof Error) {
      toast(res.message, {
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (res.status === "error") {
      toast(res.message, {
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (res.status === "success") {
      toast(res.message, {
        type: "success",
      });
      setIsSubmitting(false);
      router.push("/dashboard");
      return;
    }
  };
  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>

      <div className="relative mb-6">
        <label
          className={`absolute left-3 transition-all duration-200 ${
            emailFocused || email
              ? "-top-3.5 text-sm text-primary-red"
              : "top-3 text-gray-400"
          }`}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none"
        />
      </div>

      <div className="relative mb-8">
        <label
          className={`absolute left-3 transition-all duration-200 ${
            passwordFocused || password
              ? "-top-3.5 text-sm text-primary-red"
              : "top-3 text-gray-400"
          }`}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none"
        />
      </div>

      <button
        className="w-full bg-primary-red text-white py-2 rounded-md hover:bg-red-600 transition mb-4"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ButtonLoader /> : "Sign In"}
      </button>

      <button
        onClick={onSwitchForm}
        className="text-primary-red text-sm hover:underline w-full text-center"
      >
        Create an account
      </button>
    </div>
  );
};
