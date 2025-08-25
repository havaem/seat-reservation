"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { apiClient, type BookingSettings } from "@/lib/api";
import { DEFAULT_SETTINGS } from "@/config/settings";

export function useBookingStatus() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.settings.public(),
    queryFn: apiClient.getPublicSettings,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Fallback to defaults on error
    placeholderData: {
      bookingEnabled: DEFAULT_SETTINGS.bookingEnabled,
      maxSeatsPerOrder: DEFAULT_SETTINGS.maxSeatsPerOrder,
    } as BookingSettings,
  });

  return {
    bookingEnabled: data?.bookingEnabled ?? DEFAULT_SETTINGS.bookingEnabled,
    maxSeatsPerOrder:
      data?.maxSeatsPerOrder ?? DEFAULT_SETTINGS.maxSeatsPerOrder,
    loading: isLoading,
    error,
    refetch,
  };
}
