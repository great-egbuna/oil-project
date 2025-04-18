"use client";

// components/CommercialUsersList.tsx

import { useState } from "react";
import { FiPhone, FiMessageSquare } from "react-icons/fi";
import Overlay from "@/components/ui/Overlay";
import { useCommercialUsers } from "@/hooks/useCommercialUsers";
import { FullScreenLoader } from "../ui/Loader";

const ContactOverlay = ({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) => {
  if (!user) return null;

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-primary-red mb-6">
          Contact {user?.firstName}
        </h2>

        <div className="space-y-4">
          {user?.callNumber && (
            <a
              href={`tel:${user.callNumber}`}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiPhone className="w-6 h-6 text-primary-red" />
              <span className="text-gray-700">{user.callNumber}</span>
            </a>
          )}

          {user?.whatsappNumber && (
            <a
              href={`https://wa.me/${user.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiMessageSquare className="w-6 h-6 text-primary-red" />
              <span className="text-gray-700">{user.whatsappNumber}</span>
            </a>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-primary-red text-white rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </Overlay>
  );
};

const CommercialUsersList = () => {
  const { commercialUsers, loading, error } = useCommercialUsers();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  if (commercialUsers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No dealers/distributors found
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {commercialUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              {/* Profile Image or Initials */}
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-red/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-red">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </span>
                </div>
              )}

              <h3 className="text-xl font-semibold text-center">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-500 mt-1">{user.role}</p>

              <button
                onClick={() => setSelectedUser(user)}
                className="mt-4 w-full py-2 bg-primary-red text-white rounded hover:bg-red-600"
              >
                Contact Dealer
              </button>
            </div>
          </div>
        ))}
      </div>

      <ContactOverlay
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default CommercialUsersList;
