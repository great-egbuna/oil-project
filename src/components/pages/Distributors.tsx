"use client";

import { useState, useMemo } from "react";
import { FiPhone, FiMessageSquare, FiMapPin } from "react-icons/fi";
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
          {/* Phone Number */}
          {user?.callNumber && (
            <a
              href={`tel:${user.callNumber}`}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiPhone className="w-6 h-6 text-primary-red" />
              <span className="text-gray-700">{user.callNumber}</span>
            </a>
          )}

          {/* WhatsApp */}
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

          {/* Email */}
          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary-red"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700">{user.email}</span>
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
  const [selectedLocation, setSelectedLocation] = useState("");

  const locations = useMemo(() => {
    const addresses = commercialUsers
      .map((user) => user.officeAddress?.trim())
      .filter((address) => address && address.length > 0);
    return Array.from(new Set(addresses)).sort();
  }, [commercialUsers]);

  const filteredUsers = useMemo(() => {
    if (!selectedLocation) return commercialUsers;
    return commercialUsers.filter(
      (user) => user.officeAddress?.trim() === selectedLocation
    );
  }, [commercialUsers, selectedLocation]);

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

  return (
    <div className="p-6 py-12 max-w-7xl mx-auto">
      {/* Location Filter Section */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border rounded-md bg-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiMapPin className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {commercialUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No dealers/distributors found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center">
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
                  <p className="text-gray-500 mt-1 capitalize">{user.role}</p>

                  {user.officeAddress && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 max-w-full">
                      <FiMapPin className="mr-1.5 flex-shrink-0" />
                      <span className="truncate">{user.officeAddress}</span>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedUser(user)}
                    className="mt-4 w-full py-2 bg-primary-red text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Contact Dealer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No distributors found in {selectedLocation || "selected location"}
            </div>
          )}
        </>
      )}

      <ContactOverlay
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default CommercialUsersList;
