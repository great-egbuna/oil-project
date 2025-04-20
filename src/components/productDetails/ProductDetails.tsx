"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/service/admin.service";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "react-toastify";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import Overlay from "@/components/ui/Overlay";
import { orderService } from "@/service/orders.service";
import Image from "next/image";

const ProductDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { products } = useProducts();
  const { authenticatedUser } = useUserStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find((p) => p.id === id);
      if (foundProduct) setProduct(foundProduct);
    }
  }, [products, id]);

  const orderNow = () => {
    if (!authenticatedUser) {
      router.push("/distributors");
      return;
    }

    if (
      authenticatedUser?.role !== "admin" &&
      authenticatedUser?.role !== "Dealer" &&
      authenticatedUser?.role !== "Distributor"
    ) {
      router.push("/distributors");
      return;
    }

    setShowOrderModal(true);
  };

  const handleOrder = async () => {
    if (!product || !authenticatedUser) return;

    try {
      setIsSubmitting(true);
      setOrderError("");

      const orderResult = await orderService.storeOrder({
        productId: product.id,
        productName: `${product.type} - ${product.litre}`,
        quantity,
        totalAmount: product.price * quantity,
        transactionId,
        userId: authenticatedUser.uid,
        userName: `${authenticatedUser.firstName} ${authenticatedUser.lastName}`,
        profileImage: authenticatedUser.profileImage,
        bal: 0,
        email: authenticatedUser.email as string,
        callNumber: authenticatedUser.callNumber,
        whatsappNumber: authenticatedUser.whatsappNumber,
      });

      if (orderResult instanceof Error) throw orderResult;

      toast("Order placed successfully!", { type: "success" });
      setShowOrderModal(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
      setOrderError(message);
      toast(message, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return <FullScreenLoader />;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-gray-50 rounded-lg">
          <Image
            src={product.productImage}
            alt={product.name as string}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div className="border-b pb-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl text-primary-red mt-2">
              ₦{product.price.toLocaleString()}
              {product.discount > 0 && (
                <span className="ml-3 text-green-600 text-lg">
                  {product.discount}% OFF
                </span>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              +
            </button>
          </div>

          <button
            onClick={orderNow}
            className="w-full py-3 bg-primary-red text-white rounded hover:bg-red-600"
          >
            Order Now
          </button>
        </div>
      </div>

      {showOrderModal && (
        <Overlay onClose={() => setShowOrderModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="space-y-2">
                <p>
                  Product: {product.type} - {product.litre}
                </p>
                <p>Quantity: {quantity}</p>
                <p className="text-xl font-semibold">
                  Total: ₦{(product.price * quantity).toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Instructions</h3>
                <p className="mb-4">Please transfer payment to:</p>
                <div className="space-y-2 text-sm">
                  <p>Bank Name: JAIZ BANK</p>
                  <p>Account Name: GP GRO POWER MULTI BIZ RESOURCES</p>
                  <p>Account Number: 0017310086</p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full p-2 border rounded"
              />

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-primary-red font-bold mb-2">
                  ★ Send payment receipt to:
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@ConfluenceLube.com"
                    className="block hover:underline"
                  >
                    support@ConfluenceLube.com
                  </a>
                  <div className="flex gap-2">
                    <a href="tel:07043005952" className="hover:underline">
                      07043005952
                    </a>
                    <span>|</span>
                    <a href="tel:08089617092" className="hover:underline">
                      08089617092
                    </a>
                  </div>
                </div>
              </div>

              {orderError && (
                <p className="text-red-500 text-sm">{orderError}</p>
              )}
            </div>

            <div className="pt-6 mt-4 border-t">
              <button
                onClick={handleOrder}
                disabled={isSubmitting || !transactionId}
                className="w-full py-2 bg-primary-red text-white rounded hover:bg-red-600 disabled:opacity-70"
              >
                {isSubmitting ? <ButtonLoader /> : "Confirm Order"}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

export default ProductDetailsPage;
