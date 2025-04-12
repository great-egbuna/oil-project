import { authService } from "@/service/auth";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import { useToast } from "../ui/Toast";
import { useRouter } from "next/navigation";
import { ButtonLoader } from "../ui/Loader";
import { toast } from "react-toastify";

interface AuthFormProps {
  onSwitchForm: () => void;
}

export const SignUp = ({ onSwitchForm }: AuthFormProps) => {
  const role = useUserStore((state) => state.role);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!role) {
      toast("Please select a role", { type: "warning" });

      return;
    }
    const res = await authService.signUp({ email, password, role });

    if (res instanceof Error) {
      toast(res.message, {
        type: "error",
      });
      type: "error";
      setIsSubmitting(false);
      return;
    }

    if (res.status === "success") {
      toast("Registeration complete. Please complete your onboarding", {
        type: "success",
      });
      router.push("/onboarding");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>

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

      <div className="relative mb-6">
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

      <div className="relative mb-8">
        <label
          className={`absolute left-3 transition-all duration-200 ${
            confirmFocused || confirmPassword
              ? "-top-3.5 text-sm text-primary-red"
              : "top-3 text-gray-400"
          }`}
        >
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setConfirmFocused(true)}
          onBlur={() => setConfirmFocused(false)}
          className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none"
        />
      </div>

      <button
        className="w-full bg-primary-red text-white py-2 rounded-md hover:bg-red-600 transition mb-4"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ButtonLoader /> : "Sign Up"}
      </button>

      <button
        onClick={onSwitchForm}
        className="text-primary-red text-sm hover:underline w-full text-center"
      >
        Already have an account?
      </button>
    </div>
  );
};
