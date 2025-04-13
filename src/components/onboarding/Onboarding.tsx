"use client";

import { useUser } from "@/hooks/useUser";
import { userService } from "@/service/user.service";
import { useState, useRef } from "react";
import { FiCamera, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { ButtonLoader } from "../ui/Loader";
import { useRouter } from "next/navigation";

export default function OnboardingForm() {
  const { user } = useUser();
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(formRef.current!);
      const userData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        callNumber: formData.get("callNumber") as string,
        whatsappNumber: formData.get("whatsappNumber") as string,
        onboardingComplete: true,
      };

      let imageUrl = "";
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) {
          toast("Image upload failed", {
            type: "error",
          });
          setLoading(false);
          return;
        }

        const result = await response.json();
        imageUrl = result.secure_url;
      }

      const res = await userService.onboardUser(
        user?.uid as string,
        userData,
        imageUrl
      );

      if (res instanceof Error) {
        toast(res.message, {
          type: "error",
        });
        return;
      }

      if (res.status === "success") {
        toast("Onboarding complete", {
          type: "success",
        });

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };
  const onRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
      >
        {/* Image upload section remains unchanged */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className="w-full h-full rounded-full flex items-center justify-center cursor-pointer"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiCamera className="text-gray-400 text-2xl" />
              )}
            </label>
            {preview && (
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute -top-2 -right-2 bg-primary-red text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
          <span className="text-gray-600 text-sm">Upload Profile Photo</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                name="firstName"
                type="text"
                required
                placeholder=" "
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              />
              <label
                className="absolute left-4 top-3 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-primary-red
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
        peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-sm bg-white px-1"
              >
                First Name
              </label>
            </div>
            <div className="relative">
              <input
                name="lastName"
                type="text"
                required
                placeholder=" "
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              />
              <label
                className="absolute left-4 top-3 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-primary-red
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
        peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-sm bg-white px-1"
              >
                Last Name
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              name="callNumber"
              type="tel"
              required
              placeholder=" "
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
            />
            <label
              className="absolute left-4 top-3 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 
      peer-focus:-top-3 peer-focus:text-sm peer-focus:text-primary-red
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
      peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-sm bg-white px-1"
            >
              Call Number
            </label>
          </div>

          <div className="relative">
            <input
              name="whatsappNumber"
              type="tel"
              required
              placeholder=" "
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
            />
            <label
              className="absolute left-4 top-3 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 
      peer-focus:-top-3 peer-focus:text-sm peer-focus:text-primary-red
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
      peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-sm bg-white px-1"
            >
              WhatsApp Number
            </label>
          </div>

          {error && (
            <p className="text-primary-red text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary-red text-white py-3 rounded-md transition mt-6 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
          >
            {loading ? <ButtonLoader /> : "Complete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
