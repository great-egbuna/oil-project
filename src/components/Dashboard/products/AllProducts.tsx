"use client";

// components/ProductList.tsx
import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import Overlay from "@/components/ui/Overlay";
import { useProducts } from "@/hooks/useProducts";
import { adminService, Product } from "@/service/admin.service";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();

  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);
  const { refreshProducts } = useProducts();

  const [showDelete, setShowDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (productId: string) => {
    try {
      setDeleting(true);
      setDeletingId(productId);
      const result = await adminService.deleteProduct(productId);

      if (result instanceof Error) {
        toast(result.message, {
          type: "error",
        });
      } else {
        refreshProducts();
        toast("Deleted", {
          type: "success",
        });
      }
    } catch (error) {
      toast("Failed to delete product", {
        type: "info",
      });
    } finally {
      setDeletingId(null);
      setDeleting(false);

      setShowDelete(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

  if (authLoading) return <FullScreenLoader />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative hover:shadow-lg transition-shadow">
      <button
        onClick={() => setShowDelete(true)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        <FaTrash size={20} />
      </button>

      <div className="flex flex-col items-center">
        <img
          src={product.productImage}
          alt={product.description}
          className="w-32 h-32 object-contain mb-4 rounded-lg"
        />
        <h3 className="text-xl font-semibold text-center">
          {product.type} - {product.litre}
        </h3>
        <div className="mt-2 text-center">
          <p className="text-2xl font-bold text-primary-red">
            #{product.price.toFixed(2)}
          </p>
          {product.discount > 0 && (
            <p className="text-sm text-gray-500 line-through">
              #{(product.price / (1 - product.discount / 100)).toFixed(2)}
            </p>
          )}
        </div>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
      </div>

      {showDelete && (
        <Overlay onClose={() => setShowDelete(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Delete Product</h2>
            <p className="mb-6">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {deleting ? (
                  <ButtonLoader />
                ) : (
                  `
                Delete
    `
                )}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

export const ProductList = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found. Create your first product to get started.
        </div>
      )}
    </div>
  );
};
