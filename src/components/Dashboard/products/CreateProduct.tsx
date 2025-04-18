"use client";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { useUser } from "@/hooks/useUser";
import { adminService } from "@/service/admin.service";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ProductForm = () => {
  const router = useRouter();

  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);

  const [formData, setFormData] = useState({
    price: "",
    type: "",
    litre: "",
    description: "",
    discount: "",
    name: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!imageFile) {
      setError("Please select a product image");
      return;
    }

    if (
      !formData.price ||
      !formData.type ||
      !formData.litre ||
      !formData.description
    ) {
      setError("Please fill in all required fields (marked with *)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Image upload handling
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        toast(errorData.error || "Image upload failed", {
          type: "error",
        });

        return;
      }

      const imageUploadResult = await uploadResponse.json();

      // Create product payload
      const productData = {
        productImage: imageUploadResult.secure_url,
        price: parseFloat(formData.price),
        type: formData.type,
        litre: formData.litre,
        description: formData.description,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        name: formData.name,
      };

      // Firestore product creation
      const result = await adminService.createProduct(productData);

      if (result instanceof Error) {
        toast(result.message || "Image upload failed", {
          type: "error",
        });

        return;
      }

      // Success handling
      setFormData({
        price: "",
        type: "",
        litre: "",
        description: "",
        discount: "",
        name: "",
      });
      setImageFile(null);
      setPreviewUrl("");

      toast("Product created successfully!", {
        type: "success",
      });
    } catch (err) {
      let errorMessage = "Failed to create product";

      if (err instanceof Error) {
        errorMessage = err.message;

        // Handle specific error cases
        if (err.message.includes("network")) {
          errorMessage += " - Please check your internet connection";
        }
      }

      setError(errorMessage);
      toast(errorMessage, {
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

  if (authLoading) return <FullScreenLoader />;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Product Image
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-red transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col text-sm text-gray-600">
                <span className="font-medium">Click to upload</span>
                <span>or drag and drop</span>
              </div>
            </div>
          </div>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 h-32 w-32 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red"
              placeholder="Product name"
              required
            />
          </div>

          {/* Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white"
              required
            >
              <option value="">Select type</option>
              <option value="ShieldX">ShieldX</option>
              <option value="suppo">Suppo</option>
              <option value="Powergear">Powergear</option>
            </select>
          </div>

          {/* Litre Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Litre
            </label>
            <select
              name="litre"
              value={formData.litre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white"
              required
            >
              <option value="">Select size</option>
              <option value="1l">1L</option>
              <option value="4l">4L</option>
              <option value="5l">5L</option>
              <option value="25l">25L</option>
              <option value="Drum size">Drum size</option>
            </select>
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red"
              placeholder="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red h-32"
            placeholder="Product description..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-8 px-6 py-3 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-red hover:bg-red-600"
          } text-white`}
        >
          {isSubmitting ? <ButtonLoader /> : "Create Product"}
        </button>
      </form>
    </div>
  );
};
