"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import Image from "next/image";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { toast } from "react-toastify";
import { adminService } from "@/service/admin.service";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";

interface ImageItem {
  id: string;
  url: string;
  createdAt: Date;
}

const CMSImageGallery = () => {
  const router = useRouter();

  const { authenticatedUser } = useUser();
  const { authLoading, setCreateStaff } = useUserStoreNonPersist(
    (state) => state
  );

  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await adminService.getImages();
        setImages(images);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setSelectedFile(file);
    await handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { secure_url } = await response.json();

      // Save to Firestore
      await adminService.uploadImage(secure_url);

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      setDeletingId(id);
      const res = await adminService.deleteImage(id);

      if (res instanceof Error) {
        toast.error(res.message, {
          type: "error",
        });
        setDeletingId(null);
        return;
      }
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

  if (loading || authLoading) return <FullScreenLoader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Upload Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-dashed border-gray-200">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <div className="mb-4 text-gray-400">
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

          <span className="text-primary-red font-medium">
            {uploading ? "Uploading..." : "Click to upload"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={image.url}
              alt="Uploaded content"
              fill
              className="object-cover"
            />

            <button
              onClick={() => handleDelete(image.id)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
              disabled={deletingId === image.id}
            >
              {deletingId === image.id ? (
                <ButtonLoader />
              ) : (
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && !uploading && (
        <div className="text-center py-12 text-gray-500">
          No images uploaded yet
        </div>
      )}
    </div>
  );
};

export default CMSImageGallery;
