"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBookingStatus } from "@/hooks/useBookingStatus";
import { AlertTriangle } from "lucide-react";

export default function BookingStatusBanner() {
  const { bookingEnabled, loading } = useBookingStatus();

  // Don't show anything while loading or if booking is enabled
  if (loading || bookingEnabled) {
    return null;
  }

  return (
    <div className="border-b border-red-200 bg-red-50">
      <div className="container mx-auto px-4 py-3">
        <Alert
          variant="destructive"
          className="flex items-center border-red-300 bg-red-50"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="font-medium">
              Thông báo: Tính năng đặt vé hiện đang tạm ngưng. Vui lòng quay lại
              sau!
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
