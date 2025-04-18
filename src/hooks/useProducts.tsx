// hooks/useProducts.ts
import { adminService, Product } from "@/service/admin.service";
import { useEffect, useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllProducts();

      if (result instanceof Error) {
        setError(result);
      } else {
        setProducts(result);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load products")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return { products, loading, error, refreshProducts };
};
