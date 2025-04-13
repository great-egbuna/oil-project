"use client";

import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useState } from "react";
import { userService } from "@/service/user.service";
import { toast } from "react-toastify";
import { ButtonLoader } from "@/components/ui/Loader";

export default function UpdateUserSettings() {
  const { authenticatedUser } = useUser();
  const [firstName, setFirstName] = useState(
    authenticatedUser?.firstName || ""
  );
  const [lastName, setLastName] = useState(authenticatedUser?.lastName || "");
  const [callNumber, setCallNumber] = useState(
    authenticatedUser?.callNumber || ""
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    authenticatedUser?.whatsappNumber || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    const formData = {
      firstName,
      lastName,
      callNumber,
      whatsappNumber,
    };

    e.preventDefault();

    const result = await userService.updateUserSettings(
      authenticatedUser?.uid as string,
      formData
    );
    if (result instanceof Error) {
      toast(result.message, {
        type: "error",
      });

      setLoading(false);
      return;
    }
    toast("Settings updated successfully", {
      type: "success",
    });
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden">
          {authenticatedUser?.profileImage ? (
            <Image
              src={authenticatedUser.profileImage}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-2xl font-bold text-primary-red">
              {authenticatedUser?.firstName?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="bg-primary-red text-white px-3 py-1 rounded-full text-sm">
          {authenticatedUser?.role}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              required
            />
            <label
              htmlFor="firstName"
              className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1"
            >
              First Name *
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              required
            />
            <label
              htmlFor="lastName"
              className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1"
            >
              Last Name *
            </label>
          </div>
        </div>

        <div className="relative">
          <input
            type="tel"
            id="callNumber"
            value={callNumber}
            onChange={(e) => setCallNumber(e.target.value)}
            className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
            required
          />
          <label
            htmlFor="callNumber"
            className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1"
          >
            Call Number *
          </label>
        </div>

        <div className="relative">
          <input
            type="tel"
            id="whatsappNumber"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
            required
          />
          <label
            htmlFor="whatsappNumber"
            className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1"
          >
            WhatsApp Number *
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-red text-white py-3 rounded-md hover:bg-red-600 transition-colors"
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
