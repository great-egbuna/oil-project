// app/cms/images/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function NewsDetailPageComponent() {
  const { id } = useParams();
  const router = useRouter();

  const [image, setImage] = useState<CMSImage | null>(null);
  const [relatedImages, setRelatedImages] = useState<CMSImage[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current image
        const res = await adminService.getBlogById(id as string);
        setImage(res);

        const allNews = await adminService.getAllBlogs();

        setRelatedImages(allNews.filter((img) => img.id !== id).slice(0, 3));

        setLoading(false);
      } catch (error) {
        toast.error("Failed to load image");
        router.push("/cms/images");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading) return <FullScreenLoader />;

  if (!image)
    return (
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-red">
          COULD NOT OPEN BLOG POST
        </h2>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video bg-gray-50 rounded-xl overflow-hidden">
            <Image
              src={image?.url}
              alt={image.description}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-6">
            <time className="text-sm text-gray-400">
              {format(image.createdAt, "MMM dd, yyyy HH:mm")}
            </time>
            <p className="mt-4 text-gray-700 whitespace-pre-line">
              {image.description}
            </p>
          </div>
        </div>

        {/* Read More Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">More Posts</h2>
          {relatedImages.length > 0 ? (
            relatedImages.map((related) => (
              <Link
                key={related.id}
                href={`/cms/images/${related.id}`}
                className="block group bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image
                    src={related.url}
                    alt={related.description}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="mt-3 text-gray-600 line-clamp-2 group-hover:text-primary-red transition-colors">
                  {related.description}
                </p>
                <time className="text-xs text-gray-400 mt-1 block">
                  {format(related.createdAt, "MMM dd, yyyy")}
                </time>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No other posts available</p>
          )}
        </div>
      </div>
    </div>
  );
}
