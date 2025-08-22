"use client";

import React, { useEffect, useState } from "react";
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

interface AppSettings {
  bookingEnabled: boolean;
  maintenanceMode: boolean;
  maxSeatsPerOrder: number;
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error("Fetch settings error:", error);
      setMessage({ type: "error", text: "Không thể tải cài đặt" });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (
    key: keyof AppSettings,
    value: boolean | number,
  ) => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) throw new Error("Failed to update setting");

      setSettings((prev) => ({ ...prev, [key]: value }));
      setMessage({ type: "success", text: "Cập nhật thành công" });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Update setting error:", error);
      setMessage({ type: "error", text: "Cập nhật thất bại" });
    } finally {
      setSaving(false);
    }
  };

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
        <Button onClick={fetchSettings} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
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
                checked={settings.bookingEnabled}
                onCheckedChange={(checked: boolean) =>
                  updateSetting(SETTING_KEYS.BOOKING_ENABLED, checked)
                }
                disabled={saving}
              />
              <Badge
                variant={settings.bookingEnabled ? "default" : "destructive"}
                className="gap-1"
              >
                {settings.bookingEnabled ? (
                  <Play className="h-3 w-3" />
                ) : (
                  <Square className="h-3 w-3" />
                )}
                {settings.bookingEnabled ? "Đang hoạt động" : "Đã tắt"}
              </Badge>
            </div>
          </div>

          {/* Booking Status Alert */}
          {!settings.bookingEnabled && (
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
                value={settings.maxSeatsPerOrder}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 50) {
                    updateSetting(SETTING_KEYS.MAX_SEATS_PER_ORDER, value);
                  }
                }}
                className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center focus:border-transparent focus:ring-2 focus:ring-[#f88134] focus:outline-none"
                disabled={saving}
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
                checked={settings.maintenanceMode}
                onCheckedChange={(checked: boolean) =>
                  updateSetting(SETTING_KEYS.MAINTENANCE_MODE, checked)
                }
                disabled={saving}
              />
              <Badge
                variant={settings.maintenanceMode ? "secondary" : "outline"}
                className="gap-1"
              >
                {settings.maintenanceMode ? (
                  <Wrench className="h-3 w-3" />
                ) : (
                  <Activity className="h-3 w-3" />
                )}
                {settings.maintenanceMode ? "Đang bảo trì" : "Bình thường"}
              </Badge>
            </div>
          </div>

          {/* Maintenance Mode Alert */}
          {settings.maintenanceMode && (
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
