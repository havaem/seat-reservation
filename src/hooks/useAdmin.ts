"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { apiClient } from "@/lib/api";

export function useAdminDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: apiClient.getAdminDashboard,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for dashboard stats
    retry: 3,
  });

  return {
    dashboard: data,
    overview: data?.overview,
    seats: data?.seats,
    recentOrders: data?.recentOrders || [],
    ordersByDay: data?.ordersByDay || [],
    loading: isLoading,
    error,
    refetch,
  };
}

export function useAdminOrders(
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {},
) {
  const params = new URLSearchParams();

  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.admin.orders(filters),
    queryFn: () => apiClient.getAdminOrders(params),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    // Don't refetch automatically for orders list (user controls via pagination)
    refetchInterval: false,
    retry: 3,
  });

  return {
    orders: data?.orders || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    refetch,
    isFetching,
  };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminSeatsStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.admin.seatsStats(),
    queryFn: apiClient.getSeatsStats,
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time stats
    retry: 3,
  });

  return {
    stats: data?.stats,
    loading: isLoading,
    error,
    refetch,
  };
}

export function useAdminSettings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.admin.settings(),
    queryFn: apiClient.getAdminSettings,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false, // Manual refetch only
    retry: 3,
  });

  return {
    settings: data?.settings,
    loading: isLoading,
    error,
    refetch,
  };
}

// Mutation hooks
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      action,
      reviewNote,
    }: {
      orderId: string;
      action: "approve" | "reject";
      reviewNote?: string;
    }) => apiClient.updateOrderStatus(orderId, action, reviewNote),
    onSuccess: () => {
      // Invalidate and refetch orders and dashboard
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.seatsStats() });
    },
  });
}

export function useBulkUpdateSeats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seatIds,
      action,
    }: {
      seatIds: string[];
      action: "set_available" | "set_reserved" | "release_hold";
    }) => apiClient.bulkUpdateSeats(seatIds, action),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.seatsStats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
      queryClient.invalidateQueries({ queryKey: ["seatmap"] }); // Also invalidate public seatmap
    },
  });
}

export function useUpdateSeatStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seatId,
      status,
    }: {
      seatId: string;
      status: "available" | "reserved" | "held";
    }) => apiClient.updateSeatStatus(seatId, status),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.seatsStats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
      queryClient.invalidateQueries({ queryKey: ["seatmap"] });
    },
  });
}

export function useResetSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seatId: string) => apiClient.resetSeat(seatId),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.seatsStats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
      queryClient.invalidateQueries({ queryKey: ["seatmap"] });
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) =>
      apiClient.updateSetting(key, value),
    onSuccess: () => {
      // Invalidate settings
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings() });
      queryClient.invalidateQueries({ queryKey: ["settings", "public"] }); // Also invalidate public settings
    },
  });
}
