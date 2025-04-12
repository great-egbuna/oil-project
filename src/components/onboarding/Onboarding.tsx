"use client";

import { useState } from "react";
import { FiCamera, FiX } from "react-icons/fi";

export default function OnboardingForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onRemoveImage = () => setPreview(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
      >
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
                type="text"
                id="firstName"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none"
              />
              <label
                htmlFor="firstName"
                className="absolute left-4 top-2 text-gray-400 transition-all duration-200 pointer-events-none"
              >
                First Name
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="lastName"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none"
              />
              <label
                htmlFor="lastName"
                className="absolute left-4 top-2 text-gray-400 transition-all duration-200 pointer-events-none"
              >
                Last Name
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="tel"
              id="callNumber"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none"
            />
            <label
              htmlFor="callNumber"
              className="absolute left-4 top-2 text-gray-400 transition-all duration-200 pointer-events-none"
            >
              Call Number
            </label>
          </div>

          <div className="relative">
            <input
              type="tel"
              id="whatsappNumber"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none"
            />
            <label
              htmlFor="whatsappNumber"
              className="absolute left-4 top-2 text-gray-400 transition-all duration-200 pointer-events-none"
            >
              WhatsApp Number
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-red text-white py-3 rounded-md hover:bg-red-600 transition mt-6"
          >
            Complete Profile
          </button>
        </div>
      </form>
    </div>
  );
}
