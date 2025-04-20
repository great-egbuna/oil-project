"use client";

import { useEffect, useState } from "react";
import {
  FaTimes,
  FaTrash,
  FaUser,
  FaLock,
  FaUnlock,
  FaPaperPlane,
} from "react-icons/fa";
import Overlay from "@/components/ui/Overlay";
import { useRegularUsers } from "@/hooks/useUserAdmin";
import { adminService } from "@/service/admin.service";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { EmptyUsersCard } from "@/components/ui/NoUsers";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import Textarea from "@/components/ui/TextArea";
import { BiMessage } from "react-icons/bi";

export const UserList = () => {
  const { users, loading } = useRegularUsers();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const router = useRouter();
  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);

  const handleDeleteClick = (uid: string) => {
    setUserToDelete(uid);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await adminService.deleteStaff(id);
      if (res instanceof Error) {
        toast(res.message, { type: "error" });
      } else {
        toast("User deleted successfully", { type: "success" });
      }
    } catch (error) {
      toast("Failed to delete user", { type: "error" });
    } finally {
      setIsDeleteOpen(false);
      setUserToDelete(null);
      setDeleting(false);
    }
  };

  const handleBlockUnblock = async (uid: string) => {
    setUpdatingId(uid);
    try {
      const user = users.find((u) => u.uid === uid);
      const newStatus = user?.status === "blocked" ? "active" : "blocked";

      const res = await adminService.updateUserStatus(uid, newStatus);
      if (res instanceof Error) {
        toast(res.message, { type: "error" });
      } else {
        toast(
          `User ${
            newStatus === "blocked" ? "blocked" : "unblocked"
          } successfully`,
          { type: "success" }
        );
      }
    } catch (error) {
      toast("Failed to update user status", { type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast("Message cannot be empty", { type: "error" });
      return;
    }

    setSending(true);
    try {
      await adminService.sendMessage(
        selectedUser.uid,
        message,
        authenticatedUser?.uid || "admin"
      );
      toast("Message sent successfully", { type: "success" });
      setShowMessageForm(false);
      setMessage("");
    } catch (error) {
      toast("Failed to send message", { type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleUserClick = (user: any) => {
    console.log("Hello");
    setSelectedUser(user);
    setShowMessageForm(true);
  };

  useEffect(() => {
    if (!authLoading && authenticatedUser?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [authLoading, authenticatedUser, router]);

  if (loading) return <FullScreenLoader />;
  if (!users || users?.length === 0) return <EmptyUsersCard />;

  return (
    <div className="p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Users</h2>
      <p className="text-sm font-normal text-gray-600/70 mb-2">
        Click on a user to send them a message
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.uid}
            className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            <div
              className="flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
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

              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-xs font-normal">
                  {user.firstName} {user.lastName}
                </h3>
                <h3 className="text-xs font-normal">{user.email}</h3>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-medium text-primary-red text-xs",
                      user?.status === "blocked" && "text-gray-400"
                    )}
                  >
                    {user.role}
                  </span>
                  {user?.status === "blocked" && (
                    <span className="text-xs text-red-500">(Blocked)</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col xs:flex-row gap-2 mt-4 w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlockUnblock(user.uid);
                  }}
                  disabled={updatingId === user?.uid}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors flex-1",
                    user?.status === "blocked"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white",
                    updatingId === user?.uid && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {updatingId === user?.uid ? (
                    <ButtonLoader />
                  ) : user?.status === "blocked" ? (
                    <>
                      <FaUnlock className="w-4 h-4" />
                      <span>Unblock</span>
                    </>
                  ) : (
                    <>
                      <FaLock className="w-4 h-4" />
                      <span>Block</span>
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(user.uid);
                  }}
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors flex-1"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => handleUserClick(user)}
                  disabled={sending}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors flex-1"
                >
                  {sending ? (
                    <ButtonLoader />
                  ) : (
                    <>
                      <BiMessage className="w-4 h-4" />
                      <span>Mesage</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Overlay */}
      {showMessageForm && (
        <Overlay onClose={() => setShowMessageForm(false)}>
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Message {selectedUser?.firstName}
              </h2>
              <button
                onClick={() => setShowMessageForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[150px] mb-4"
            />

            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="w-full px-4 py-2 bg-primary-red text-white rounded hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {sending ? (
                <ButtonLoader />
              ) : (
                <>
                  <FaPaperPlane className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </Overlay>
      )}

      {/* Delete Confirmation Overlay */}
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
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(userToDelete!)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {deleting ? <ButtonLoader /> : "Delete User"}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};
