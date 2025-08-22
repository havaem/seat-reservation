"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "@/config/settings";

export function useBookingStatus() {
  const [bookingEnabled, setBookingEnabled] = useState(
    DEFAULT_SETTINGS.bookingEnabled,
  );
  const [maxSeatsPerOrder, setMaxSeatsPerOrder] = useState(
    DEFAULT_SETTINGS.maxSeatsPerOrder,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        const response = await fetch("/api/settings/public");
        if (response.ok) {
          const data = await response.json();
          setBookingEnabled(data.bookingEnabled);
          setMaxSeatsPerOrder(
            data.maxSeatsPerOrder || DEFAULT_SETTINGS.maxSeatsPerOrder,
          );
        }
      } catch (error) {
        console.error("Error checking booking status:", error);
        // Default values if there's an error
        setBookingEnabled(DEFAULT_SETTINGS.bookingEnabled);
        setMaxSeatsPerOrder(DEFAULT_SETTINGS.maxSeatsPerOrder);
      } finally {
        setLoading(false);
      }
    };

    checkBookingStatus();

    // Check status every 30 seconds
    const interval = setInterval(checkBookingStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return { bookingEnabled, maxSeatsPerOrder, loading };
}
