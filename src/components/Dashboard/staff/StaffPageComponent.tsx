"use client";

import { useState } from "react";
import { FaTrash, FaTimes, FaUserPlus, FaUsers } from "react-icons/fa";
import Overlay from "@/components/ui/Overlay";
import { useStaff } from "@/hooks/useStaff";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import Link from "next/link";
import { toast } from "react-toastify";
import { adminService } from "@/service/admin.service";
import { useStaffTasks } from "@/hooks/useTasks";
import { TaskList } from "./TaskList/TaskList";

export default function StaffPageComponent() {
  const { staffs, loading } = useStaff();
  const [selectedStaff, setSelectedStaff] = useState<{
    firstName: string;
    lastName: string;
    uid: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("task");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { tasks, loading: loadingTask } = useStaffTasks(
    selectedStaff?.uid as string
  );

  const handleCardClick = (staff) => {
    setSelectedStaff(staff);
    setIsOverlayOpen(true);
  };

  const handleDeleteClick = (e, staff) => {
    e.stopPropagation();
    setSelectedStaff(staff);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    if (selectedStaff) {
      const res = await adminService.deleteStaff(selectedStaff?.uid);
      setIsDeleteConfirmOpen(false);
      setSelectedStaff(null);
      if (res instanceof Error) {
        toast.error(res.message);
      } else {
        toast.success("Deleted", {
          type: "success",
        });
      }
    }

    setIsDeleting(false);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!selectedStaff) {
      toast("No staff member selected", {
        type: "error",
      });
      setSubmitting(false);
      return;
    }

    try {
      await adminService.addTask({
        uid: selectedStaff.uid,
        firstName: selectedStaff.firstName,
        lastName: selectedStaff.lastName,
        task: taskForm.name,
        description: taskForm.description,
      });

      // Close overlay and reset form
      setIsOverlayOpen(false);
      setTaskForm({ name: "", description: "" });

      // Optional: Show success notification
      toast("Task created successfully!", {
        type: "success",
      });
      setSubmitting(false);
    } catch (error) {
      console.error("Task creation failed:", error);
      setSubmitting(false);
      toast("Failed to create task. Please try again.", {
        type: "error",
      });
    }
  };

  if (loading) return <FullScreenLoader />;

  if (staffs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 overflow-y-hidden">
        <div className="max-w-[400px] w-full text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur opacity-30"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg">
              <FaUsers className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-bold text-gray-900">
            No Team Members Found
          </h2>
          <p className="mt-4 text-gray-500">
            Get started by adding new staff members to your team. Click the
            button below to invite your first team member.
          </p>

          <div className="mt-8">
            <Link
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-sm transition-all duration-200"
              href={"/dashboard/new-user"}
            >
              <FaUserPlus className="mr-2 -ml-1 h-5 w-5" />
              Add First Team Member
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {staffs.map((staff) => (
          <div
            key={staff.id}
            onClick={() => handleCardClick(staff)}
            className="relative cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <button
              onClick={(e) => handleDeleteClick(e, staff)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTrash size={20} />
            </button>

            <div className="flex flex-col items-center">
              {staff.profileImage ? (
                <img
                  src={staff.profileImage}
                  alt={`${staff.firstName} ${staff.lastName}`}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">
                    {staff.firstName[0]}
                    {staff.lastName[0]}
                  </span>
                </div>
              )}
              <h3 className="text-base font-semibold text-center">
                Name: {staff.firstName} {staff.lastName}
              </h3>

              <h3 className="text-base font-semibold text-center">
                Email: {staff.email}
              </h3>

              <h3 className="text-base font-semibold text-center">
                Phone: {staff.callNumber}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Task Overlay */}

      {isOverlayOpen && (
        <Overlay onClose={() => setIsOverlayOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full ">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {selectedStaff?.firstName}'s Tasks
              </h2>
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="border-b mb-4">
              <div className="flex gap-4">
                <button
                  className={`pb-2 px-4 ${
                    activeTab === "task" ? "border-b-2 border-primary-red" : ""
                  }`}
                  onClick={() => setActiveTab("task")}
                >
                  Create Task
                </button>
                <button
                  className={`pb-2 px-4 ${
                    activeTab === "All Tasks"
                      ? "border-b-2 border-primary-red"
                      : ""
                  }`}
                  onClick={() => setActiveTab("All Tasks")}
                >
                  Details
                </button>
              </div>
            </div>

            {activeTab === "task" && (
              <form onSubmit={handleTaskSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Task Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={taskForm.name}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    className="w-full p-2 border rounded h-32"
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-red text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {submitting ? <ButtonLoader /> : "Create Task"}
                </button>
              </form>
            )}

            {activeTab === "All Tasks" && (
              <div>
                {loadingTask ? (
                  <div className="m-auto"></div>
                ) : (
                  <TaskList tasks={tasks} uid={selectedStaff?.uid as string} />
                )}
              </div>
            )}
          </div>
        </Overlay>
      )}

      {/* Delete Confirmation Overlay */}

      {isDeleteConfirmOpen && (
        <Overlay onClose={() => setIsDeleteConfirmOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete {selectedStaff?.firstName}{" "}
              {selectedStaff?.lastName}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-600 w-[50px]"
              >
                {isDeleting ? <ButtonLoader /> : "Delete"}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}
