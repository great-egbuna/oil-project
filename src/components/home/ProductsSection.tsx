"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/service/admin.service";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const ProductCard = ({ product }: { product: Product }) => {
 
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ">
      <div className="flex flex-col items-center h-full">
        <div className="relative w-full h-[200px] mb-4">
          <Image
            src={product?.productImage}
            alt={product?.name as string}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">
              {product.type} - {product.litre}
            </h3>
            {product.discount > 0 && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">
              {truncateText(product.description, 100)}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-primary-red">
                ₦{product.price.toLocaleString()}
              </p>
              {product.discount > 0 && (
                <p className="text-gray-400 line-through">
                  ₦
                  {(
                    product.price /
                    (1 - product.discount / 100)
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="w-full py-2 bg-primary-red text-white rounded hover:bg-red-600 text-center"
        >
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
