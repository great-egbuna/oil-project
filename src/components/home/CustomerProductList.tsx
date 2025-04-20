"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { FullScreenLoader } from "../ui/Loader";
import ProductCard from "./ProductsSection";

const CustomerProductList = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <FullScreenLoader />;
  if (error)
    return <div className="text-red-500 p-4">Error: {error.message}</div>;

  if (products?.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">
        No products available at the moment.
      </div>
    );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CustomerProductList;
