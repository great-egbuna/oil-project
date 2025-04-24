// app/cms/images/page.tsx
"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { adminService } from "@/service/admin.service";
import { FullScreenLoader } from "../ui/Loader";

interface CMSImage {
  id: string;
  url: string;
  description: string;
  createdAt: Date;
}

export default function AllNewsPage() {
  const [images, setImages] = useState<CMSImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await adminService.getAllBlogs();
        setImages(res);
      } catch (error) {
        toast.error("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">News</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Link
            key={image.id}
            href={`/news/${image.id}`}
            className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.description}
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-600 line-clamp-2 mb-2 group-hover:text-primary-red transition-colors">
                {image.description}
              </p>
              <time className="text-sm text-gray-400">
                {format(image.createdAt, "MMM dd, yyyy HH:mm")}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
