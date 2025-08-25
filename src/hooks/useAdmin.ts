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
    stats: data?.stats,
    recentOrders: data?.recentOrders || [],
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
