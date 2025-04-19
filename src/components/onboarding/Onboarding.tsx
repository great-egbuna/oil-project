"use client";

import { useUser } from "@/hooks/useUser";
import { userService } from "@/service/user.service";
import { useState, useRef } from "react";
import { FiCamera, FiX, FiChevronDown, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { ButtonLoader } from "../ui/Loader";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function OnboardingForm() {
  const { user } = useUser();
  const router = useRouter();
  const { role, setAuthenticatedUser } = useUserStore((state) => state);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    callNumber: "",
    whatsappNumber: "",
    officeAddress: "",
    warehouseCapacity: "200",
    passportFile: null as File | null,
    hearAboutUs: "Facebook",
    otherProducts: "",
    businessDuration: "Less than a year",
    marketingTeam: "Yes",
    regions: [] as string[],
    declaration: false,
  });

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

    const form = e.currentTarget;
    const commonData = new FormData(form as HTMLFormElement);
    const commonDataValue = Object.fromEntries(commonData.entries());

    try {
      // Upload profile image
      let imageUrl = "";
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: uploadFormData,
        });
        if (!response.ok) throw new Error("Profile image upload failed");
        const result = await response.json();
        imageUrl = result.secure_url;
      }

      // Upload passport image
      let passportUrl = "";
      if (formData.passportFile) {
        const passportFormData = new FormData();
        passportFormData.append("file", formData.passportFile);
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: passportFormData,
        });
        if (!response.ok) throw new Error("Passport image upload failed");
        const result = await response.json();
        passportUrl = result.secure_url;
      }

      // Prepare user data
      const userData = {
        ...formData,
        ...commonDataValue,
        onboardingComplete: true,
        profileImage: imageUrl,
        passportFile: passportUrl,
      };

      const res = await userService.onboardUser(user?.uid as string, userData);
      if (res instanceof Error) {
        toast(res.message, {
          type: "error",
        });
        return;
      }

      if (res.userId) {
        toast("Onboarding complete", {
          type: "success",
        });

        setAuthenticatedUser(res as any);
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

          {role === "Dealer" || role === "Distributor" ? (
            <div className="space-y-6">
              {/* Office Address */}
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
                  onChange={(e) =>
                    setFormData({ ...formData, officeAddress: e.target.value })
                  }
                />
                <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
                  Office Address *
                </label>
              </div>

              {/* Warehouse Capacity Dropdown */}
              <div className="relative">
                <select
                  required
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer bg-transparent"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      warehouseCapacity: e.target.value,
                    })
                  }
                >
                  <option value="" disabled hidden></option>
                  {[200, 400, 600, 1000, 2000, 3000, 4000, 5000].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                  <option value="10000">Above 10,000</option>
                </select>
                <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                  Warehouse/Store Capacity *
                </label>
                <FiChevronDown className="absolute right-4 top-3 text-gray-400" />
              </div>

              {/* Passport Upload */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passportFile: e.target.files?.[0] || null,
                    })
                  }
                  className="hidden"
                  id="passport-upload"
                />
                <label
                  htmlFor="passport-upload"
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none flex items-center cursor-pointer"
                >
                  <FiUpload className="mr-2" />
                  <span>Upload Passport Photo *</span>
                </label>
              </div>

              {/* How Did You Hear About Us */}
              <div className="relative">
                <select
                  required
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer"
                  onChange={(e) =>
                    setFormData({ ...formData, hearAboutUs: e.target.value })
                  }
                >
                  <option value="" disabled hidden></option>
                  {[
                    "Facebook",
                    "Instagram",
                    "Radio jingle",
                    "Billboard",
                    "TV advert",
                    "Newspaper",
                    "Online marketplaces",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                  How Did You Hear About Us? *
                </label>
                <FiChevronDown className="absolute right-4 top-3 text-gray-400" />
              </div>

              {/* Other Oil Products */}
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
                  onChange={(e) =>
                    setFormData({ ...formData, otherProducts: e.target.value })
                  }
                />
                <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
                  What Other Oil Products Do You Use? *
                </label>
              </div>

              {/* Business Duration */}
              <div className="relative">
                <select
                  required
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessDuration: e.target.value,
                    })
                  }
                >
                  <option value="" disabled hidden></option>
                  {[
                    "Less than 1 year",
                    "1-3 years",
                    "3-5 years",
                    "5-10 years",
                    "10+ years",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                  Business Duration *
                </label>
                <FiChevronDown className="absolute right-4 top-3 text-gray-400" />
              </div>

              {/* Marketing Team */}
              <div className="relative">
                <select
                  required
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer"
                  onChange={(e) =>
                    setFormData({ ...formData, marketingTeam: e.target.value })
                  }
                >
                  <option value="" disabled hidden></option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                  Marketing Team? *
                </label>
                <FiChevronDown className="absolute right-4 top-3 text-gray-400" />
              </div>

              {/* Regions Checkboxes */}
              <div className="relative">
                <div className="border-b-2 border-gray-300 pb-4">
                  <label className="text-gray-400 text-sm">Key Regions *</label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {nigerianStates.map((state) => (
                      <label
                        key={state}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.regions.includes(state)}
                          onChange={(e) => {
                            const regions = e.target.checked
                              ? [...formData.regions, state]
                              : formData.regions.filter((s) => s !== state);
                            setFormData({ ...formData, regions });
                          }}
                          className="text-primary-red focus:ring-primary-red"
                        />
                        <span>{state}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="relative flex items-start space-x-3 mt-6">
                <input
                  type="checkbox"
                  required
                  checked={formData.declaration}
                  onChange={(e) =>
                    setFormData({ ...formData, declaration: e.target.checked })
                  }
                  className="mt-1 text-primary-red focus:ring-primary-red"
                />
                <label className="text-sm text-gray-700">
                  By submitting this, I certify that the information provided is
                  accurate and truthful. I understand that any false or
                  misleading information may result in the cancellation of my
                  application and termination of any account with Confluence
                  Lube and Oil Company *
                </label>
              </div>
            </div>
          ) : null}

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
