"use client";

import { useEffect, useState, useCallback } from "react";
import { DEFAULT_SETTINGS } from "@/config/settings";

// Global state to share between hook instances
const globalBookingState = {
  bookingEnabled: DEFAULT_SETTINGS.bookingEnabled,
  maxSeatsPerOrder: DEFAULT_SETTINGS.maxSeatsPerOrder,
  loading: true,
  lastFetch: 0,
  interval: null as NodeJS.Timeout | null,
  subscribers: new Set<() => void>(),
};

const CACHE_DURATION = 30000; // 30 seconds cache
const REFETCH_INTERVAL = 30000; // 30 seconds interval

const fetchBookingStatus = async () => {
  try {
    const response = await fetch("/api/settings/public");
    if (response.ok) {
      const data = await response.json();
      globalBookingState.bookingEnabled = data.bookingEnabled;
      globalBookingState.maxSeatsPerOrder =
        data.maxSeatsPerOrder || DEFAULT_SETTINGS.maxSeatsPerOrder;
    }
  } catch (error) {
    console.error("Error checking booking status:", error);
    // Keep current values or use defaults if first time
    globalBookingState.bookingEnabled =
      globalBookingState.bookingEnabled ?? DEFAULT_SETTINGS.bookingEnabled;
    globalBookingState.maxSeatsPerOrder =
      globalBookingState.maxSeatsPerOrder ?? DEFAULT_SETTINGS.maxSeatsPerOrder;
  } finally {
    globalBookingState.loading = false;
    globalBookingState.lastFetch = Date.now();

    // Notify all subscribers
    globalBookingState.subscribers.forEach((callback) => callback());
  }
};

export function useBookingStatus() {
  const [state, setState] = useState({
    bookingEnabled: globalBookingState.bookingEnabled,
    maxSeatsPerOrder: globalBookingState.maxSeatsPerOrder,
    loading: globalBookingState.loading,
  });

  const forceUpdate = useCallback(() => {
    setState({
      bookingEnabled: globalBookingState.bookingEnabled,
      maxSeatsPerOrder: globalBookingState.maxSeatsPerOrder,
      loading: globalBookingState.loading,
    });
  }, []);

  useEffect(() => {
    // Subscribe to global state changes
    globalBookingState.subscribers.add(forceUpdate);

    // Check if we need to fetch data
    const shouldFetch =
      globalBookingState.loading ||
      Date.now() - globalBookingState.lastFetch > CACHE_DURATION;

    if (shouldFetch) {
      fetchBookingStatus();
    }

    // Start interval if not already running
    if (!globalBookingState.interval) {
      globalBookingState.interval = setInterval(
        fetchBookingStatus,
        REFETCH_INTERVAL,
      );
    }

    // Cleanup function
    return () => {
      globalBookingState.subscribers.delete(forceUpdate);

      // If no more subscribers, clear the interval
      if (
        globalBookingState.subscribers.size === 0 &&
        globalBookingState.interval
      ) {
        clearInterval(globalBookingState.interval);
        globalBookingState.interval = null;
      }
    };
  }, [forceUpdate]);

  return state;
}
