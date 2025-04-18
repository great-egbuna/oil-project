"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaTrash, FaUser } from "react-icons/fa";
import Overlay from "@/components/ui/Overlay";
import { useRegularUsers } from "@/hooks/useUserAdmin";
import { adminService } from "@/service/admin.service";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { EmptyUsersCard } from "@/components/ui/NoUsers";
import { toast } from "react-toastify";

interface UserCardProps {
  users: Array<{
    uid: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    role: string;
  }>;
  onDelete: (uid: string) => void;
}

export const UserList = () => {
  const { users, loading } = useRegularUsers();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);

  const handleDeleteClick = (uid: string) => {
    setUserToDelete(uid);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    setDeleting(true);
    if (userToDelete) {
      // also can be used to delete normal users
      const res = await adminService.deleteStaff(id);

      if (res instanceof Error) {
        toast(res.message, {
          type: "error",
        });
      } else {
        toast("Deleted", {
          type: "success",
        });
      }
      setIsDeleteOpen(false);
      setUserToDelete(null);

      setDeleting(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "text-red-500";
      case "staff":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

  if (loading) return <FullScreenLoader />;

  if (!users || users?.length === 0) return <EmptyUsersCard />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.uid}
            className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <button
              onClick={() => handleDeleteClick(user.uid)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <FaTrash size={20} />
            </button>

            <div className="flex flex-col items-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                  <FaUser className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <h3 className="text-xl font-semibold text-center">
                {user.firstName} {user.lastName}
              </h3>{" "}
              <h3 className="text-xl font-semibold text-center text-black/70">
                {user.email}
              </h3>
              <span
                className={`mt-2 text-sm font-medium ${getRoleColor(
                  user.role as string
                )}`}
              >
                {user.role}
              </span>
            </div>

            {isDeleteOpen && (
              <Overlay onClose={() => setIsDeleteOpen(false)}>
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Confirm Delete</h2>
                    <button
                      onClick={() => setIsDeleteOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <p className="mb-6">
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </p>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsDeleteOpen(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(user?.uid)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      {deleting ? (
                        <ButtonLoader />
                      ) : (
                        `           Delete User
  `
                      )}
                    </button>
                  </div>
                </div>
              </Overlay>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Overlay */}
    </div>
  );
};
