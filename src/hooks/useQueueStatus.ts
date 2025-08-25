"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { apiClient } from "@/lib/api";

export function useQueueStatus() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.queue.status(),
    queryFn: apiClient.getQueueStatus,
    staleTime: 0, // Always fresh for queue status
    gcTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 1000, // Check every 5 seconds
    retry: (failureCount, error) => {
      // Don't retry on 429 (user is in queue)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (error as any)?.status;
      if (status === 429) return false;
      return failureCount < 3;
    },
    retryDelay: 2000, // Quick retry for queue status
  });

  return {
    queueStatus: data,
    canAccess: data?.canAccess ?? true,
    position: data?.position ?? 0,
    estimatedWaitTime: data?.estimatedWaitTime ?? 0,
    queueLength: data?.queueLength ?? 0,
    loading: isLoading,
    error,
    refetch,
    isInQueue: data ? !data.canAccess : false,
  };
}
