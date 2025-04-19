"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import Overlay from "@/components/ui/Overlay";
import { orderService } from "@/service/orders.service";
import { Product } from "@/service/admin.service";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "react-toastify";
import { ButtonLoader, FullScreenLoader } from "../ui/Loader";

const CustomerProductList = () => {
  const { authenticatedUser, isLoggedIn } = useUserStore();
  const { products, loading, error } = useProducts();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [step, setStep] = useState(1);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    // Initialize quantities
    const initialQuantities = products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [products]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleOrderClick = (product: Product) => {
    if (!authenticatedUser) {
      toast("Please login to continue", {
        type: "warning",
      });

      return;
    }
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedProduct || !authenticatedUser || !transactionId) {
      toast("Please login to continue", {
        type: "warning",
      });

      return;
    }

    try {
      setIsSubmitting(true);
      setOrderError("");

      const orderResult = await orderService.storeOrder({
        productId: selectedProduct.id,
        productName: `${selectedProduct.type} - ${selectedProduct.litre}`,
        quantity: quantities[selectedProduct.id],
        totalAmount: selectedProduct.price * quantities[selectedProduct.id],
        transactionId,
        userId: authenticatedUser?.uid as string,
      });

      if (orderResult instanceof Error) {
        toast(orderResult.message, {
          type: "error",
        });
        return;
      }

      setShowOrderModal(false);
      setStep(1);
      setTransactionId("");
      toast("Order placed successfully!", {
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
      setOrderError(message);

      toast(message, {
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* if (!authenticatedUser) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center mt-12">
        <h2 className="text-xl font-semibold mb-4">
          Please login to place orders
        </h2>
        <p className="text-gray-600">
          You need to be logged in to purchase our products
        </p>
      </div>
    );
  } */

  if (loading) return <FullScreenLoader />;
  if (error)
    return <div className="text-red-500 p-4">Error: {error.message}</div>;

  if (products?.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">
        No products found. Create your first product to get started.
      </div>
    );
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <img
                src={product.productImage}
                alt={product.description}
                className="w-32 h-32 object-contain mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold text-center">
                {product.type} - {product.litre}
              </h3>
              <p className="text-2xl font-bold text-primary-red my-2">
                #{product.price.toFixed(2)}
              </p>

              <div className="flex items-center gap-4 my-4">
                <button
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-lg">{quantities[product.id] || 1}</span>
                <button
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleOrderClick(product)}
                className="w-full py-2 bg-primary-red text-white rounded hover:bg-red-600"
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
      {showOrderModal && (
        <Overlay
          onClose={() => {
            setShowOrderModal(false);
            setStep(1);
          }}
        >
          <div className="bg-white rounded-lg p-6  ">
            {step === 1 && (
              // Step 1: Order Summary
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {selectedProduct && (
                  <div className="w-full">
                    <div className="space-y-2 mb-4 ">
                      <p>
                        Product: {selectedProduct.type} -{" "}
                        {selectedProduct.litre}
                      </p>
                      <p>Quantity: {quantities[selectedProduct.id]}</p>
                      <p className="text-lg font-semibold">
                        Total: ₦
                        {(
                          selectedProduct.price * quantities[selectedProduct.id]
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">
                        Payment Instructions
                      </h3>
                      <p className="mb-4">Please transfer payment to:</p>
                      <div className="space-y-2">
                        <p>Bank Name: JAIZ BANK</p>
                        <p>Account Name: GP GRO POWER MULTI BIZ RESOURCES</p>
                        <p>Account Number: 0017310086</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-2 bg-primary-red text-white rounded hover:bg-red-600"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              // Step 2: Transaction ID
              <>
                <h2 className="text-xl font-semibold mb-4">Confirm Payment</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full p-2 border rounded"
                  />

                  <button
                    onClick={() => setStep(3)}
                    disabled={!transactionId}
                    className="w-full py-2 bg-primary-red text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              // Step 3: Contact Information
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Payment Confirmation
                </h2>
                <div className="space-y-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-primary-red font-bold mb-2">
                      ★ Please send your payment receipt to:
                    </p>
                    <div className="space-y-3">
                      <a
                        href="mailto:support@ConfluenceLube.com"
                        className="block text-primary-red font-bold hover:underline"
                      >
                        Email: support@ConfluenceLube.com
                      </a>
                      <div className="flex items-center gap-2">
                        <a
                          href="tel:07043005952"
                          className="text-primary-red font-bold hover:underline"
                        >
                          Phone: 07043005952
                        </a>
                        <span className="text-primary-red">||</span>
                        <a
                          href="tel:08089617092"
                          className="text-primary-red font-bold hover:underline"
                        >
                          08089617092
                        </a>
                      </div>
                    </div>
                  </div>

                  {orderError && (
                    <p className="text-red-500 text-sm">{orderError}</p>
                  )}

                  <button
                    onClick={handlePaymentConfirmation}
                    disabled={isSubmitting}
                    className={`w-full py-2 ${
                      isSubmitting ? "bg-gray-400" : "bg-primary-red"
                    } text-white rounded hover:bg-red-600`}
                  >
                    {isSubmitting ? <ButtonLoader /> : "Confirm Payment"}
                  </button>
                </div>
              </>
            )}
          </div>
        </Overlay>
      )}
    </div>
  );
};

export default CustomerProductList;
