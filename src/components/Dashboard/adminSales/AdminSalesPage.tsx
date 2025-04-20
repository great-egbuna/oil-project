"use client";

import { useEffect, useState } from "react";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { adminService } from "@/service/admin.service";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { OrderData } from "@/service/orders.service";

interface MonthlySales {
  month: string;
  totalSales: number;
  totalOrders: number;
  orders: OrderData[];
}

export default function SalesPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchConfirmedOrders();
  }, []);

  const fetchConfirmedOrders = async () => {
    try {
      setLoading(true);
      const orders = await adminService.getConfirmedOrders();
      processMonthlySales(orders as OrderData[]);
    } catch (error) {
      toast.error("Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  const processMonthlySales = (orders: OrderData[]) => {
    const salesMap = new Map<string, MonthlySales>();

    orders.forEach((order) => {
      const monthKey = format(new Date(order.createdAt as string), "yyyy-MM");
      const monthName = format(
        new Date(order.createdAt as string),
        "MMMM yyyy"
      );

      const existing = salesMap.get(monthKey) || {
        month: monthName,
        totalSales: 0,
        totalOrders: 0,
        orders: [],
      };

      salesMap.set(monthKey, {
        month: monthName,
        totalSales: existing.totalSales + order.totalAmount,
        totalOrders: existing.totalOrders + 1,
        orders: [...existing.orders, order],
      });
    });

    setMonthlySales(Array.from(salesMap.values()));
  };

  const handleMonthChange = (monthKey: string) => {
    setSelectedMonth(monthKey);
  };

  if (loading) return <FullScreenLoader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales Report</h1>

      {/* Month Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Month
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="w-full md:w-64 p-2 border rounded-md bg-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
        >
          <option value="">Select a month</option>
          {monthlySales.map((month) => (
            <option key={month.month} value={month.month}>
              {month.month}
            </option>
          ))}
        </select>
      </div>

      {/* Sales Summary */}
      {selectedMonth && (
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">
              {monthlySales.find((m) => m.month === selectedMonth)?.month}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-700">
                  ₦
                  {monthlySales
                    .find((m) => m.month === selectedMonth)
                    ?.totalSales.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-700">
                  {
                    monthlySales.find((m) => m.month === selectedMonth)
                      ?.totalOrders
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order List */}
      {selectedMonth && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="p-4 text-lg font-semibold border-b">
            Confirmed Orders
          </h3>
          <div className="p-4">
            {monthlySales.find((m) => m.month === selectedMonth)?.orders
              .length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found for this month
              </div>
            ) : (
              <div className="grid gap-4">
                {monthlySales
                  .find((m) => m.month === selectedMonth)
                  ?.orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-sm text-gray-500">
                            {format(
                              new Date(order.createdAt as string),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            ₦{order.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {order.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
