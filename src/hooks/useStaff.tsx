"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/service/admin.service";

export const useStaff = () => {
  const [staffs, setStaffs] = useState<
    Array<{ id: string; [key: string]: any }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await adminService.getAllStaff();

        if (result instanceof Error) {
          setError(result.message);
          console.log(result.message);

          return;
        } else {
          setStaffs(result);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load staff");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return { staffs, loading, error };
};
