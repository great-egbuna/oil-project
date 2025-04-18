// hooks/useCommercialUsers.ts
import { generalService } from "@/service/general.service";
import { useEffect, useState } from "react";

export const useCommercialUsers = () => {
  const [commercialUsers, setCommercialUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await generalService.getDealersOrDistributors();

        if (result instanceof Error) {
          setError(result);
        } else {
          setCommercialUsers(result);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load users")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { commercialUsers, loading, error };
};
