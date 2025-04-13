"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiCheckCircle } from "react-icons/fi";

export default function ContactAdminCard() {
  const [copied, setCopied] = useState(false);
  const email = "support@cl.com";
  const phoneNumber = "+234 812 345 6789";

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
      <h3 className="text-xl font-semibold text-primary-red mb-4 flex items-center">
        Contact Admin
      </h3>

      <div className="space-y-4">
        <a
          href={`mailto:${email}`}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <FiMail className="text-gray-500 text-xl group-hover:text-primary-red" />
          <span className="text-gray-700 group-hover:text-primary-red">
            {email}
          </span>
        </a>

        <button
          onClick={handleCopyNumber}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group relative"
        >
          <FiPhone className="text-gray-500 text-xl group-hover:text-primary-red" />
          <span className="text-gray-700 group-hover:text-primary-red">
            {phoneNumber}
          </span>

          {copied && (
            <div className="absolute right-4 flex items-center space-x-1 text-sm text-primary-red">
              <FiCheckCircle />
              <span>Copied!</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
