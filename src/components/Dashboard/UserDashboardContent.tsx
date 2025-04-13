"use client";

import Image from "next/image";
import Link from "next/link";

const orders = [
  {
    id: 1,
    productName: "Engine Oil 5W-30",
    price: 29.99,
    quantity: 2,
    imageUrl:
      "https://images.pexels.com/photos/8943269/pexels-photo-8943269.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    productName: "Brake Pads Set",
    price: 45.5,
    quantity: 1,
    imageUrl:
      "https://images.pexels.com/photos/8943269/pexels-photo-8943269.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    productName: "Air Filter",
    price: 15.99,
    quantity: 4,
    imageUrl:
      "https://images.pexels.com/photos/8943269/pexels-photo-8943269.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    productName: "Spark Plug",
    price: 8.99,
    quantity: 6,
    imageUrl:
      "https://images.pexels.com/photos/8943269/pexels-photo-8943269.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default function UserDashboardContent() {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Previous Orders
        </h2>
        {/*    <Link
          href="/orders"
          className="text-sm sm:text-base text-primary-red hover:text-red-600 font-medium transition-colors"
        >
          View All
        </Link> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md sm:shadow-md sm:hover:shadow-lg transition-shadow duration-200 flex  flex-col gap-g  justify-between"
          >
            <div className="flex-1">
              <Image
                src={order.imageUrl}
                alt={order.productName}
                objectFit="cover"
                className="w-full h-full rounded-md"
                width={50}
                height={50}
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-3 mt-3">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                  {order.productName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Qty: {order.quantity}
                </p>
              </div>
              <span className="text-base sm:text-lg font-bold text-primary-red">
                ${order.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
