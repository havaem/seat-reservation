"use client";

import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Settings as SettingsIcon,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users,
  ShieldOff,
  Play,
  Square,
  Wrench,
  Activity,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SETTING_KEYS, DEFAULT_SETTINGS } from "@/config/settings";
import { useAdminSettings, useUpdateSetting } from "@/hooks/useAdmin";
import { toast } from "sonner";

interface AppSettings {
  bookingEnabled: boolean;
  maintenanceMode: boolean;
  maxSeatsPerOrder: number;
}

export default function SettingsManagement() {
  const { settings, loading, error, refetch } = useAdminSettings();
  const updateSettingMutation = useUpdateSetting();

  const handleSettingChange = useCallback(
    async (key: string, value: unknown) => {
      try {
        await updateSettingMutation.mutateAsync({ key, value });
        toast.success("Cài đặt đã được cập nhật");
      } catch (error) {
        console.error("Update setting error:", error);
        toast.error("Cập nhật cài đặt thất bại");
      }
    },
    [updateSettingMutation],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cài đặt hệ thống
            </h1>
            <p className="mt-1 text-gray-600">Quản lý cấu hình ứng dụng</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f88134] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="mt-1 text-gray-600">Quản lý cấu hình ứng dụng</p>
        </div>
        <Button onClick={() => refetch()} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      {/* Error handling */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Lỗi tải cài đặt: {error.message}</AlertDescription>
        </Alert>
      )}

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-[#f88134]" />
            Cài đặt đặt vé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Enabled */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="bookingEnabled" className="text-base font-medium">
                Cho phép đặt vé
              </Label>
              <p className="text-sm text-gray-600">
                Bật/tắt tính năng đặt vé trên website. Khi tắt, khách hàng sẽ
                không thể đặt vé mới.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="bookingEnabled"
                checked={
                  (settings as unknown as AppSettings)?.bookingEnabled ?? false
                }
                onCheckedChange={(checked: boolean) =>
                  handleSettingChange(SETTING_KEYS.BOOKING_ENABLED, checked)
                }
                disabled={updateSettingMutation.isPending}
              />
              <Badge
                variant={
                  (settings as unknown as AppSettings)?.bookingEnabled
                    ? "default"
                    : "destructive"
                }
                className="gap-1"
              >
                {(settings as unknown as AppSettings)?.bookingEnabled ? (
                  <Play className="h-3 w-3" />
                ) : (
                  <Square className="h-3 w-3" />
                )}
                {(settings as unknown as AppSettings)?.bookingEnabled
                  ? "Đang hoạt động"
                  : "Đã tắt"}
              </Badge>
            </div>
          </div>

          {/* Booking Status Alert */}
          {!(settings as unknown as AppSettings)?.bookingEnabled && (
            <Alert variant="destructive">
              <ShieldOff className="h-4 w-4" />
              <AlertDescription>
                <strong>Chú ý:</strong> Tính năng đặt vé đang bị tắt. Khách hàng
                sẽ không thể đặt vé mới cho đến khi bạn bật lại.
              </AlertDescription>
            </Alert>
          )}

          {/* Max Seats Per Order */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label
                htmlFor="maxSeatsPerOrder"
                className="text-base font-medium"
              >
                Số ghế tối đa mỗi đơn
              </Label>
              <p className="text-sm text-gray-600">
                Giới hạn số lượng ghế tối đa mà một khách hàng có thể đặt trong
                một lần.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="50"
                value={
                  (settings as unknown as AppSettings)?.maxSeatsPerOrder ?? 1
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 50) {
                    handleSettingChange(
                      SETTING_KEYS.MAX_SEATS_PER_ORDER,
                      value,
                    );
                  }
                }}
                className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center focus:border-transparent focus:ring-2 focus:ring-[#f88134] focus:outline-none"
                disabled={updateSettingMutation.isPending}
              />
              <span className="text-sm text-gray-500">ghế</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5 text-[#f88134]" />
            Cài đặt hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label
                htmlFor="maintenanceMode"
                className="text-base font-medium"
              >
                Chế độ bảo trì
              </Label>
              <p className="text-sm text-gray-600">
                Bật chế độ bảo trì để hiển thị thông báo bảo trì cho người dùng.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="maintenanceMode"
                checked={
                  (settings as unknown as AppSettings)?.maintenanceMode ?? false
                }
                onCheckedChange={(checked: boolean) =>
                  handleSettingChange(SETTING_KEYS.MAINTENANCE_MODE, checked)
                }
                disabled={updateSettingMutation.isPending}
              />
              <Badge
                variant={
                  (settings as unknown as AppSettings)?.maintenanceMode
                    ? "secondary"
                    : "outline"
                }
                className="gap-1"
              >
                {(settings as unknown as AppSettings)?.maintenanceMode ? (
                  <Wrench className="h-3 w-3" />
                ) : (
                  <Activity className="h-3 w-3" />
                )}
                {(settings as unknown as AppSettings)?.maintenanceMode
                  ? "Đang bảo trì"
                  : "Bình thường"}
              </Badge>
            </div>
          </div>

          {/* Maintenance Mode Alert */}
          {(settings as unknown as AppSettings)?.maintenanceMode && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Thông tin:</strong> Chế độ bảo trì đang được bật.
                Website sẽ hiển thị thông báo bảo trì cho người dùng.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
