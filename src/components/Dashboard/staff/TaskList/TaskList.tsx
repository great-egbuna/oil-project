import { useState } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaCheck,
} from "react-icons/fa";
import Overlay from "@/components/ui/Overlay";
import { adminService, Task } from "@/service/admin.service";
import { ButtonLoader } from "@/components/ui/Loader";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/useUserStore"; // Add this import
import { generalService } from "@/service/general.service";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  uid: string;
}

export const TaskList = ({ tasks, uid }: TaskListProps) => {
  const { authenticatedUser } = useUserStore(); // Get authenticated user
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteOpen(true);
  };

  const handleMarkComplete = async (taskId: string) => {
    setIsCompleting(taskId);
    try {
      const res = await generalService.updateTaskStatus(
        taskId,
        "completed",
        authenticatedUser?.uid as string
      );

      if (res instanceof Error) {
        toast(res.message, {
          type: "error",
        });

        return;
      }

      toast("Task marked as complete!", { type: "success" });
      setCompleted(true);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Update failed", {
        type: "error",
      });
    } finally {
      setIsCompleting(null);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      if (taskToDelete) {
        await adminService.deleteTask(id, authenticatedUser?.uid as string);
        toast("Deleted!", { type: "success" });
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "Deletion failed", {
        type: "error",
      });
    } finally {
      setIsDeleteOpen(false);
      setTaskToDelete(null);
      setIsDeleting(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "border-yellow-500 text-yellow-500";
      case "completed":
        return "border-green-500 text-green-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        return (
          <div key={task.id}>
            <div
              className={`p-4 border-l-4 rounded-lg shadow-sm bg-white ${getStatusStyles(
                task.status
              )}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{task.task}</h3>
                  <p className="text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Show delete button only for admins */}
                  {authenticatedUser?.role === "admin" && (
                    <button
                      onClick={() => handleDeleteClick(task.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete task"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  )}

                  {/* Show complete button for task owner if not completed */}
                  {task.uid === authenticatedUser?.uid &&
                    task.status !== "completed" && (
                      <button
                        onClick={() => handleMarkComplete(task.id)}
                        disabled={!!isCompleting}
                        className={cn(
                          "flex items-center gap-2 px-2 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

                          {
                            hidden: completed,
                          }
                        )}
                        aria-label="Mark as complete"
                      >
                        {isCompleting === task.id ? (
                          <ButtonLoader color="green" />
                        ) : (
                          <>
                            <FaCheck />
                            <span>Mark as Complete</span>
                          </>
                        )}
                      </button>
                    )}
                </div>
              </div>

              <div className="flex items-center mt-3">
                <span
                  className={`inline-flex items-center text-sm ${getStatusStyles(
                    task.status
                  )}`}
                >
                  {task.status === "completed" ? (
                    <FaCheckCircle className="mr-2 w-4 h-4" />
                  ) : (
                    <FaExclamationCircle className="mr-2 w-4 h-4" />
                  )}
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                {task.createdAt && (
                  <span className="ml-auto text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {isDeleteOpen && (
              <Overlay onClose={() => setIsDeleteOpen(false)}>
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4">Delete Task</h2>
                  <p className="mb-6">
                    Are you sure you want to delete this task? This action
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
                      onClick={() => handleConfirmDelete(task.id)}
                      className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-600 w-full"
                    >
                      {isDeleting ? <ButtonLoader /> : "Delete Task"}
                    </button>
                  </div>
                </div>
              </Overlay>
            )}
          </div>
        );
      })}
    </div>
  );
};
