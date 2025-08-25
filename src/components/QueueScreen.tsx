"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, RefreshCw } from "lucide-react";

interface QueueStatus {
  canAccess: boolean;
  position: number;
  estimatedWaitTime: number;
  queueLength?: number;
}

export function QueueScreen() {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkQueueStatus = async () => {
    try {
      const response = await fetch("/api/queue/status");
      const data = await response.json();
      setQueueStatus(data);

      if (data.canAccess) {
        // User can now access, reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Queue check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkQueueStatus();

    // Check every 5 seconds
    const interval = setInterval(checkQueueStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} giây`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg">Đang kiểm tra...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!queueStatus || queueStatus.canAccess) {
    return null; // User can access
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white">
          <CardTitle className="text-2xl font-bold">
            🎭 Hàng đợi đặt vé
          </CardTitle>
          <p className="text-blue-100">
            Hiện tại có nhiều người truy cập, vui lòng chờ trong giây lát
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* Queue Position */}
          <div className="text-center">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <span className="text-3xl font-bold text-blue-600">
                {queueStatus.position}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Vị trí của bạn trong hàng đợi
            </h3>
          </div>

          {/* Estimated Wait Time */}
          <div className="flex items-center justify-center space-x-3 rounded-lg bg-amber-50 p-4">
            <Clock className="h-6 w-6 text-amber-600" />
            <div>
              <p className="text-sm text-gray-600">Thời gian chờ dự kiến</p>
              <p className="text-lg font-semibold text-amber-700">
                {formatWaitTime(queueStatus.estimatedWaitTime)}
              </p>
            </div>
          </div>

          {/* Queue Info */}
          {queueStatus.queueLength && (
            <div className="flex items-center justify-center space-x-3 rounded-lg bg-gray-50 p-4">
              <Users className="h-6 w-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng số người chờ</p>
                <p className="text-lg font-semibold text-gray-700">
                  {queueStatus.queueLength} người
                </p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="mb-2 font-semibold text-green-800">💡 Lưu ý:</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Vui lòng không tắt trang này</li>
              <li>• Hệ thống sẽ tự động cập nhật</li>
              <li>• Bạn sẽ được chuyển vào trang đặt vé khi đến lượt</li>
            </ul>
          </div>

          {/* Auto refresh indicator */}
          <div className="text-center text-sm text-gray-500">
            <RefreshCw className="mr-2 inline h-4 w-4 animate-spin" />
            Tự động cập nhật mỗi 5 giây
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
