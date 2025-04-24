"use client";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { useUser } from "@/hooks/useUser";
import { adminService } from "@/service/admin.service";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ImageData {
  url: string;
  description: string;
}

export default function NewBlogPage() {
  const router = useRouter();

  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !description) return;

    setIsLoading(true);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Image upload failed");

      const { secure_url } = await uploadResponse.json();

      // Save to Firestore
      await adminService.saveBlog({
        url: secure_url,
        description,
      });

      toast.success("Image uploaded successfully!");
      setSelectedFile(null);
      setDescription("");
      setPreview("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

  if (authLoading) return <FullScreenLoader />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Upload Image</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <label className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="space-y-2">
                <div className="mx-auto text-gray-400">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">
                  Drag and drop or{" "}
                  <span className="text-primary-red font-medium">browse</span>
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
            rows={4}
            placeholder="Enter image description..."
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || !description || isLoading}
          className="w-full bg-primary-red text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <ButtonLoader /> : "Upload Image"}
        </button>
      </form>
    </div>
  );
}
