"use client";

import { useStaffTasks } from "@/hooks/useTasks";
import { TaskList } from "../staff/TaskList/TaskList";
import { useUserStore } from "@/store/useUserStore";
import { FullScreenLoader } from "@/components/ui/Loader";

export default function UserTasks() {
  const authenticatedUser = useUserStore((state) => state.authenticatedUser);

  const { tasks, loading: loadingTask } = useStaffTasks(
    authenticatedUser?.uid as string
  );

  if (loadingTask) return <FullScreenLoader />;

  if (!tasks?.length)
    return (
      <div className="flex items-center">
        <h2 className="text-gray-600">You Do Not Have A Task Assigned Yet</h2>
      </div>
    );

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        Your Task
      </h2>
      <TaskList tasks={tasks} uid={authenticatedUser?.uid as string} />
    </div>
  );
}
