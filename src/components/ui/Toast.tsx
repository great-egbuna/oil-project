"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiX, FiAlertCircle } from "react-icons/fi";

interface ToastProps {
  message: string;
  duration?: number;
  onRemove: () => void;
  variant?: "error" | "success";
}

export const Toast = ({
  message,
  duration = 3000,
  onRemove,
  variant = "success",
}: ToastProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onRemove();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onRemove]);

  const bgColor = variant === "error" ? "bg-primary-red" : "bg-primary-blue";
  const Icon = variant === "error" ? FiAlertCircle : FiCheckCircle;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4`}
          >
            <Icon className="flex-shrink-0" size={24} />
            <span className="font-medium">{message}</span>
            <button
              onClick={() => {
                setShow(false);
                onRemove();
              }}
              className={`hover:${
                variant === "error" ? "bg-red-800" : "bg-blue-800"
              } rounded-full p-1`}
            >
              <FiX size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Updated useToast hook
export const useToast = () => {
  const [toasts, setToasts] = useState<
    { id: string; message: string; variant: "error" | "success" }[]
  >([]);

  const addToast = (
    message: string,
    variant: "error" | "success" = "success"
  ) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            onRemove={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return {
    addToast,
    ToastContainer,
  };
};
