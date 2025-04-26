"use client";

import { useStaffTasks } from "@/hooks/useTasks";
import { TaskList } from "../staff/TaskList/TaskList";
import { useUserStore } from "@/store/useUserStore";
import { FullScreenLoader } from "@/components/ui/Loader";

export default function UserTasks() {
  const authenticatedUser: any = useUserStore(
    (state) => state.authenticatedUser
  );

  const { tasks, loading: loadingTask } = useStaffTasks(
    authenticatedUser?.uid as string
  );

  if (loadingTask) return <FullScreenLoader />;

  return (
    <div className="space-y-6">
      {/* Staff Details Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Your Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
          <div className="space-y-2">
            <div>
              <p className="text-gray-500 font-medium">Bank Account Number</p>
              <p className="text-gray-800">
                {authenticatedUser?.bankAccountNo || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Bank Name</p>
              <p className="text-gray-800">
                {authenticatedUser?.bankName || "N/A"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-gray-500 font-medium">Expected Salary</p>
              <p className="text-gray-800">
                {authenticatedUser?.expectedSalary
                  ? `₦${Number(
                      authenticatedUser.expectedSalary
                    ).toLocaleString()}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Date of Employment</p>
              <p className="text-gray-800">
                {authenticatedUser?.dateOfEmployment || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      {!tasks?.length ? (
        <div className="flex items-center">
          <h2 className="text-gray-600">You Do Not Have A Task Assigned Yet</h2>
        </div>
      ) : (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Your Tasks
          </h2>
          <TaskList tasks={tasks} uid={authenticatedUser?.uid as string} />
        </div>
      )}
    </div>
  );
}
