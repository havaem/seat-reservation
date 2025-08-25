"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { apiClient } from "@/lib/api";

export function useSeatMap() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.seats.map(),
    queryFn: apiClient.getSeatMap,
    staleTime: 10 * 1000, // 10 seconds (seats change frequently)
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 15 * 1000, // Refetch every 15 seconds for real-time updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    seatMap: data,
    seats: data?.seats || [],
    pricingTiers: data?.pricingTiers || [],
    loading: isLoading,
    error,
    refetch,
    isFetching, // Useful to show subtle loading indicators during background refetch
  };
}
