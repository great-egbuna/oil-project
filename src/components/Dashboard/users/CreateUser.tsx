"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { FiCamera, FiChevronDown, FiX, FiUpload } from "react-icons/fi";
import { adminService } from "@/service/admin.service";
import { toast } from "react-toastify";
import { ButtonLoader } from "@/components/ui/Loader";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "@/service/firebase";

export default function CreateUser() {
  const router = useRouter();
  const { authenticatedUser } = useUser();
  const { authLoading, setCreateStaff } = useUserStoreNonPersist(
    (state) => state
  );

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

  const nigerianBanks = [
    "Access Bank",
    "Citibank Nigeria",
    "Ecobank Nigeria",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Guaranty Trust Bank",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    "Opay",
    "Moniepoint"
  ];

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    callNumber: "",
    role: "",
    regions: [] as string[],
    officeAddress: "",
    warehouseCapacity: "",
    hearAboutUs: "",
    otherProducts: "",
    businessDuration: "",
    marketingTeam: "",
    position: "",
    bankAccountNo: "",
    bankName: "",
    expectedSalary: "",
    dateOfEmployment: "",
    declaration: false,
    passportFile: null as File | null,
  });

  const handleRegionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    state: string
  ) => {
    const regions = formData.regions || [];
    if (e.target.checked) {
      setFormData({ ...formData, regions: [...regions, state] });
    } else {
      setFormData({ ...formData, regions: regions.filter((s) => s !== state) });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStaff(true);
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const commonData = new FormData(form as HTMLFormElement);
    const commonDataValue = Object.fromEntries(commonData.entries());

    const adminApp = initializeApp(firebaseConfig, "AdminApp");
    const adminAuth = getAuth(adminApp);

    try {
      if (!selectedFile) {
        toast("Profile image is required", { type: "error" });
        return;
      }

      const profileFormData = new FormData();
      profileFormData.append("file", selectedFile);
      const profileResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: profileFormData,
      });

      if (!profileResponse.ok) throw new Error("Profile image upload failed");
      const profileResult = await profileResponse.json();

      let passportUrl = "";
      if (["Dealer", "Distributor"].includes(formData.role)) {
        if (!formData.passportFile) {
          toast("Passport photo is required", { type: "error" });
          setLoading(false);
          return;
        }

        const passportFormData = new FormData();
        passportFormData.append("file", formData.passportFile);
        const passportResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: passportFormData,
        });

        if (!passportResponse.ok) throw new Error("Passport upload failed");
        const passportResult = await passportResponse.json();
        passportUrl = passportResult.secure_url;
      }

      const { passportFile, ...restData } = formData;
      const staffData = {
        ...restData,
        ...commonDataValue,
        profileImage: profileResult.secure_url,
        passportFile: passportUrl,
      };

      const result = await adminService.addUser(
        formData.email,
        formData.password,
        staffData
      );

      adminAuth.signOut();

      if (result instanceof Error) {
        toast(result.message, { type: "error" });
        return;
      }

      toast("Staff created successfully", { type: "success" });
      setPreview(null);
      setSelectedFile(null);
      formRef.current?.reset();
    } catch (err: any) {
      setError(err.message || "Failed to create staff account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authenticatedUser?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [authLoading]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Staff
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="staff-avatar"
              required
            />
            <label
              htmlFor="staff-avatar"
              className="w-full h-full rounded-full flex items-center justify-center cursor-pointer"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiCamera className="text-gray-400 text-2xl" />
              )}
            </label>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                }}
                className="absolute -top-2 -right-2 bg-primary-red text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
          <span className="text-gray-600 text-sm">Upload Profile Photo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
              Email *
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
              Password *
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="firstName"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
              First Name *
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="lastName"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
              Last Name *
            </label>
          </div>

          <div className="relative">
            <input
              type="tel"
              id="callNumber"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              onChange={(e) =>
                setFormData({ ...formData, callNumber: e.target.value })
              }
            />
            <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
              Call Number *
            </label>
          </div>

          <div className="relative">
            <input
              type="tel"
              id="whatsappNumber"
              required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
              onChange={(e) =>
                setFormData({ ...formData, whatsappNumber: e.target.value })
              }
            />
            <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
              WhatsApp Number *
            </label>
          </div>

          <div className="relative col-span-full">
            <div className="relative">
              <select
                id="role"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                value={formData.role || ""}
              >
                <option value="" disabled hidden></option>
                <option value="Dealer">Dealer</option>
                <option value="Distributor">Distributor</option>
                <option value="Staff">Staff</option>
                <option value="Car Driver">Car Driver</option>
                <option value="Keke Driver">Keke Driver</option>
                <option value="Mechanic">Mechanic</option>
              </select>
              <label
                htmlFor="role"
                className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1"
              >
                Role *
              </label>
              <div className="absolute right-4 top-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {formData.role === "Staff" && (
          <div className="space-y-6 mt-4">
            <div className="relative">
              <input
                type="text"
                id="position"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
                Position In Company *
              </label>
            </div>

            {/* New Staff Fields */}
            <div className="relative">
              <input
                type="text"
                id="bankAccountNo"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
                onChange={(e) =>
                  setFormData({ ...formData, bankAccountNo: e.target.value })
                }
              />
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
                Bank Account Number *
              </label>
            </div>

            <div className="relative">
              <select
                id="bankName"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                value={formData.bankName || ""}
              >
                <option value="" disabled hidden></option>
                {nigerianBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                Bank Name *
              </label>
              <div className="absolute right-4 top-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                id="expectedSalary"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
                onChange={(e) =>
                  setFormData({ ...formData, expectedSalary: e.target.value })
                }
              />
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
                Expected Salary (NGN) *
              </label>
            </div>

            <div className="relative">
              <input
                type="date"
                id="dateOfEmployment"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none peer"
                onChange={(e) =>
                  setFormData({ ...formData, dateOfEmployment: e.target.value })
                }
              />
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm bg-white px-1">
                Date of Employment *
              </label>
            </div>
          </div>
        )}

        {(formData.role === "Dealer" || formData.role === "Distributor") && (
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="officeAddress"
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

            <div className="relative">
              <select
                id="warehouseCapacity"
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
                {[200, 400, 600, 1000, 2000, 3000, 4000, 5000, 10000].map(
                  (size) => (
                    <option key={size} value={size}>
                      {size === 10000 ? "Above 10,000" : size}
                    </option>
                  )
                )}
              </select>
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                Warehouse/Store Capacity *
              </label>
              <div className="absolute right-4 top-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                id="passport"
                required
                className="hidden"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passportFile: e.target.files?.[0] as File,
                  })
                }
              />
              <label
                htmlFor="passport"
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none flex items-center cursor-pointer"
              >
                <FiUpload className="mr-2" />
                <span className="text-gray-700">Upload Passport Photo *</span>
              </label>
            </div>

            <div className="relative">
              <select
                id="hearAboutUs"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, hearAboutUs: e.target.value })
                }
              >
                <option value="" disabled hidden></option>
                {[
                  "Facebook",
                  "Instagram",
                  "Radio Jingle",
                  "Billboard",
                  "TV Advert",
                  "Newspaper",
                  "Online Marketplaces",
                ].map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                How Did You Hear About Us? *
              </label>
              <div className="absolute right-4 top-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                id="otherProducts"
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

            <div className="relative">
              <select
                id="businessDuration"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, businessDuration: e.target.value })
                }
              >
                <option value="" disabled hidden></option>
                {[
                  "Less than 1 year",
                  "1-3 years",
                  "3-5 years",
                  "5-10 years",
                  "10+ years",
                ].map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                How Long in Lubricants Business? *
              </label>
              <div className="absolute right-4 top-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                id="marketingTeam"
                required
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-primary-red outline-none appearance-none peer bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, marketingTeam: e.target.value })
                }
              >
                <option value="" disabled hidden></option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <label className="absolute left-4 top-2 text-gray-400 transition-all duration-200 peer-focus:-top-4 peer-focus:text-sm peer-[:not([value=''])]:-top-4 peer-[:not([value=''])]:text-sm bg-white px-1">
                Do You Have a Marketing Team? *
              </label>
              <div className="absolute right-4 top-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <div className="border-b-2 border-gray-300 focus-within:border-primary-red">
                <label className="text-gray-400 text-sm">
                  Select Key Regions *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto p-2">
                  {nigerianStates.map((state) => (
                    <label key={state} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={state}
                        onChange={(e) => handleRegionChange(e, state)}
                        className="text-primary-red focus:ring-primary-red"
                      />
                      <span className="text-gray-700">{state}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex items-start space-x-3">
              <input
                type="checkbox"
                id="declaration"
                required
                className="mt-1 text-primary-red focus:ring-primary-red"
                onChange={(e) =>
                  setFormData({ ...formData, declaration: e.target.checked })
                }
              />
              <label htmlFor="declaration" className="text-sm text-gray-700">
                By submitting this, I certify that the information provided is
                accurate and truthful. I understand that any false or misleading
                information may result in the cancellation of my application and
                termination of any account with Confluence Lube and Oil Company
                *
              </label>
            </div>
          </div>
        )}

        {error && (
          <p className="text-primary-red text-center text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-red text-white py-3 rounded-md hover:bg-red-600 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
        >
          {loading ? <ButtonLoader /> : "Create Staff Account"}
        </button>
      </form>
    </div>
  );
}
