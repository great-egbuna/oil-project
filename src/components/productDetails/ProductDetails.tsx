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
import { useCart } from "@/context/appContext";

interface CartItem extends Product {
  quantity: number;
  totalAmount: number;
}

// Global state cache
let cartCache: CartItem[] = [];

const ProductDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { products } = useProducts();
  const { cartItems, setCartItems, setShowOrderModal, showOrderModal } =
    useCart();
  const { authenticatedUser } = useUserStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Sync with cache
  useEffect(() => {
    setCartItems(cartCache);
  }, []);

  useEffect(() => {
    cartCache = cartItems;
  }, [cartItems]);

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find((p) => p.id === id);
      if (foundProduct) setProduct(foundProduct);
    }
  }, [products, id]);

  const addToCart = () => {
    if (!product) return;

    const existingItem = cartItems.find((item) => item.id === product.id);
    const newItems = existingItem
      ? cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cartItems, { ...product, quantity }];

    setCartItems(newItems as any);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleOrder = async () => {
    if (!authenticatedUser) return;

    try {
      setIsSubmitting(true);
      setOrderError("");

      // Group orders by productId
      const groupedOrders = cartItems.reduce((acc, item) => {
        const existing = acc[item.id];
        if (existing) {
          existing.quantity += item.quantity;
          existing.totalAmount += item.price * item.quantity;
        } else {
          acc[item.id] = {
            ...item,
            quantity: item.quantity,
            totalAmount: item.price * item.quantity,
          };
        }
        return acc;
      }, {} as Record<string, CartItem>);

      // Convert to array and create orders
      const orderPromises = Object.values(groupedOrders).map((item: any) =>
        orderService.storeOrder({
          productId: item.id,
          productName: `${item.type} - ${item.litre}`,
          quantity: item.quantity,
          totalAmount: item.totalAmount,
          transactionId,
          userId: authenticatedUser.uid,
          userName: `${authenticatedUser.firstName} ${authenticatedUser.lastName}`,
          profileImage: authenticatedUser.profileImage,
          bal: 0,
          email: authenticatedUser.email as string,
          callNumber: authenticatedUser.callNumber,
          whatsappNumber: authenticatedUser.whatsappNumber,
          status: "pending",
          createdAt: new Date().toISOString(),
        })
      );

      await Promise.all(orderPromises);

      toast.success("Order placed successfully!");
      setShowOrderModal(false);
      setCartItems([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
      setOrderError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!product) return <FullScreenLoader />;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-gray-50 rounded-lg">
          <Image
            src={product.productImage}
            alt={product.name as string}
            fill
            className="object-contain rounded-lg"
            priority
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

          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className="flex-1 py-3 bg-primary-red text-white rounded hover:bg-red-600"
            >
              Add to Cart
            </button>
            <button
              onClick={() => router.push("/products")}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Order More
            </button>
          </div>
        </div>

        {/* Fixed Order Summary */}
        {cartItems.length > 0 && (
          <div className="fixed top-[70%] right-4 bg-white p-4 rounded-lg shadow-xl border z-50">
            <div className="flex items-center gap-6">
              <div>
                <h3 className="font-semibold">
                  Total: ₦{totalAmount.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">
                  {cartItems.length} items (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  units)
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(true)}
                className="px-6 py-2 bg-primary-red text-white rounded hover:bg-red-600 min-w-[150px]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {/* Order Modal */}
        {showOrderModal && (
          <Overlay onClose={() => setShowOrderModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] flex flex-col">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {item.name} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.type} - {item.litre}
                        </p>
                      </div>
                      <p className="text-primary-red">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Instructions</h3>
                  <p className="mb-4">Please transfer payment to:</p>
                  <div className="space-y-2 text-sm">
                    <p>Bank Name: JAIZ BANK</p>
                    <p>Account Name: GP GRO POWER MULTI BIZ RESOURCES</p>
                    <p>Account Number: 0017310086</p>
                  </div>
                </div>

                <div className="text-xl font-bold text-right">
                  Total: ₦{totalAmount.toLocaleString()}
                </div>

                <input
                  type="text"
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
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
    </div>
  );
};

export default ProductDetailsPage;
