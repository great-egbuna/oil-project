import { useState, useEffect } from "react";
import { adminService, User } from "@/service/admin.service";

export const useRegularUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await adminService.getAllUsers();

        if (!isMounted) return;

        if (result instanceof Error) {
          setError(result);
        } else {
          setUsers(result);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load users")
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { users, loading, error };
};
