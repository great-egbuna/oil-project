import { adminService, Task } from "@/service/admin.service";
import { useEffect, useState } from "react";

export const useStaffTasks = (uid: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await adminService.getStaffTask(uid);

        if (result instanceof Error) {
          setError(result);
        } else {
          setTasks(result);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchTasks();
    } else {
      setLoading(false);
      setTasks([]);
    }
  }, [uid]);

  return { tasks, loading, error };
};
