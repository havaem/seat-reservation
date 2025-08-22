"use client";

import BookAction from "./BookAction";
import PageTitle from "./ui/title";
import { useBookingStatus } from "@/hooks/useBookingStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const SeatReservation = () => {
  const { bookingEnabled, loading } = useBookingStatus();

  return (
    <section id="dat-ve">
      <div className="flex min-h-[800px] flex-col justify-center gap-8 px-4 py-10">
        <PageTitle className="text-center text-white">Đặt Vé</PageTitle>
        <div className="mb-6 w-full">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
              <span className="ml-3 text-white">
                Đang kiểm tra trạng thái đặt vé...
              </span>
            </div>
          ) : !bookingEnabled ? (
            <div className="mx-auto max-w-4xl">
              <Alert
                variant="destructive"
                className="border-red-600 bg-red-900/20 backdrop-blur-sm"
              >
                <AlertTriangle className="h-5 w-5" />
                <AlertDescription className="text-lg text-white">
                  <strong>Thông báo:</strong> Tính năng đặt vé hiện đang tạm
                  ngưng. Chúng tôi sẽ thông báo khi mở lại. Cảm ơn bạn đã quan
                  tâm!
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <BookAction />
          )}
        </div>
      </div>
    </section>
  );
};
export default SeatReservation;
