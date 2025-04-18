import { useState } from "react";
import { FaTrash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Overlay from "@/components/ui/Overlay";
import { adminService, Task } from "@/service/admin.service";
import { ButtonLoader } from "@/components/ui/Loader";
import { toast } from "react-toastify";

interface TaskListProps {
  tasks: Task[];
  uid: string;
}

export const TaskList = ({ tasks, uid }: TaskListProps) => {
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    if (taskToDelete) {
      await adminService.deleteTask(id, uid);
      setIsDeleteOpen(false);
      setTaskToDelete(null);

      toast("Deleted!", {
        type: "success",
      });
    }
    setIsDeleting(false);
    setIsDeleteOpen(false);
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
      {tasks.map((task) => (
        <div key={task.id}>
          <div
            className={`p-4 border-l-4 rounded-lg shadow-sm bg-white ${getStatusStyles(
              task.status
            )}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{task.task}</h3>
                <p className="text-gray-600 line-clamp-2">{task.description}</p>
              </div>

              <button
                onClick={() => handleDeleteClick(task.id)}
                className="text-gray-400 hover:text-red-500 ml-4"
                aria-label="Delete task"
              >
                <FaTrash className="w-5 h-5" />
              </button>
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
                  Are you sure you want to delete this task? This action cannot
                  be undone.
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
                    {isDeleting ? <ButtonLoader /> : "  Delete Task"}
                  </button>
                </div>
              </div>
            </Overlay>
          )}
        </div>
      ))}

      {/* Delete Confirmation Overlay */}
    </div>
  );
};
