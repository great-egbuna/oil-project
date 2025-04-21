"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { adminService } from "@/service/admin.service";
import { orderService } from "@/service/orders.service";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "react-toastify";
import { FullScreenLoader } from "@/components/ui/Loader";

interface Product {
  id: string;
  productImage: string;
  price: number;
  type: string;
  litre: string;
  description: string;
  discount: number;
  status: string;
  name?: string;
}

export default function ProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, loading } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    productImage: "",
    price: 0,
    type: "",
    litre: "",
    description: "",
    discount: 0,
    status: "active",
    name: "",
  });

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find((p) => p.id === id);
      setFormData(foundProduct as any);
      if (foundProduct) setProduct(foundProduct);
    }
  }, [products, id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await adminService.updateProduct(id as any, formData);

    if (res instanceof Error) {
      toast(res.message, {
        type: "error",
      });

      setSubmitting(false);
      return;
    }

    toast("Update sucessful", {
      type: "success",
    });

    setSubmitting(false);
  };

  if (loading) return <FullScreenLoader />;
  if (!product) return <div className="text-center p-8">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {product.productImage && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Current Image
            </label>
            <Image
              src={product.productImage}
              alt="Product image"
              width={200}
              height={200}
              className="rounded-lg border"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Product name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Price"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Litre</label>
            <input
              type="text"
              name="litre"
              value={formData.litre}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Litre measurement"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Product type"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Discount percentage"
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md h-32"
            placeholder="Product description"
            required
          />
        </div>

        {/*     <div className="space-y-2">
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="url"
            name="productImage"
            value={formData.productImage}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            placeholder="Image URL"
            required
          />
        </div> */}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-70"
        >
          {submitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
