import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import type { Snapshot, CreateSnapshotRequest } from "@/types/snapshot";

// Hook to fetch user's snapshots
export function useSnapshots() {
  return useQuery({
    queryKey: ["snapshots"],
    queryFn: async (): Promise<Snapshot[]> => {
      const response = await clientApi.get<Snapshot[]>("/snapshots");
      if (!response.success) {
        throw new Error("Failed to fetch snapshots");
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to create a new snapshot
export function useCreateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSnapshotRequest): Promise<Snapshot> => {
      const response = await clientApi.post<Snapshot>("/snapshots", data);
      if (!response.success || !response.data) {
        throw new Error("Failed to create snapshot");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch snapshots
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}

// Hook to delete a snapshot
export function useDeleteSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshotId: string): Promise<void> => {
      const response = await clientApi.delete(`/snapshots/${snapshotId}`);
      if (!response.success) {
        throw new Error("Failed to delete snapshot");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch snapshots
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}
