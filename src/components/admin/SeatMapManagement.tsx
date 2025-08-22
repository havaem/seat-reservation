"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeatDoc } from "@/models/Seat";
import {
  AlertTriangle,
  CheckCircle,
  Edit,
  RefreshCw,
  Save,
} from "lucide-react";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { renderClassNameColorSeat } from "@/utils/renderClassnameSeat";
import { toast } from "sonner";

interface PricingTier {
  code: string;
  name: string;
  price: number;
}

// Memoized function to split seats - only recalculates when seats array changes
const splitLeftRight = (arr: SeatDoc[], groupSize = 10) => {
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i += groupSize) {
    const group = arr.slice(i, i + groupSize);
    left.push(...group.slice(0, 5));
    right.push(...group.slice(-5));
  }

  return { left, right };
};

interface AdminSeatItemProps {
  data: SeatDoc;
  onSelect: (seatId: string) => void;
  isSelected: boolean;
  onEdit: (seat: SeatDoc) => void;
}

// Memoized AdminSeatItem component to prevent unnecessary re-renders
const AdminSeatItem = memo<AdminSeatItemProps>(
  ({ data, onSelect, isSelected, onEdit }) => {
    // Memoize the className to avoid recalculation
    const seatClassName = useMemo(
      () =>
        cn(
          "relative col-span-1 flex w-full items-center justify-center rounded-md border-2 px-1 py-2 text-xs font-bold transition-all",
          renderClassNameColorSeat(data.status),
          isSelected && "border-blue-500 ring-2 ring-blue-200",
          "hover:scale-105 hover:shadow-md",
        ),
      [data.status, isSelected],
    );

    // Memoize click handlers
    const handleSelect = useCallback(() => {
      onSelect(data.seatId);
    }, [onSelect, data.seatId]);

    const handleEdit = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(data);
      },
      [onEdit, data],
    );

    return (
      <div className="group relative">
        <button
          className={seatClassName}
          onClick={handleSelect}
          title={`Ghế ${data.seatId} - ${data.status}`}
        >
          {data.seatId}
        </button>

        {/* Admin overlay */}
        <Button
          onClick={handleEdit}
          className="absolute top-1/2 left-full z-10 hidden h-6 w-6 -translate-y-1/2 p-0 group-hover:flex"
          size="icon"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    );
  },
);

// Set display name for debugging
AdminSeatItem.displayName = "AdminSeatItem";

export default function SeatMapManagement() {
  const [seats, setSeats] = useState<{
    left: SeatDoc[];
    right: SeatDoc[];
  }>({
    left: [],
    right: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [editingSeat, setEditingSeat] = useState<SeatDoc | null>(null);
  const [editValues, setEditValues] = useState({
    seatId: "",
    status: "",
  });
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Memoize split seats to avoid recalculation on every render
  const splitSeats = useMemo(() => {
    const allSeats = [...seats.left, ...seats.right];
    if (allSeats.length === 0) return { left: [], right: [] };
    return splitLeftRight(allSeats);
  }, [seats.left, seats.right]);

  // Memoized fetch function
  const fetchSeats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/seatmap");
      if (!response.ok) throw new Error("Failed to fetch seats");

      const data = await response.json();
      const { left, right } = splitLeftRight(data.seats);
      setSeats({ left, right });
    } catch (error) {
      console.error("Fetch seats error:", error);
      setMessage({ type: "error", text: "Không thể tải danh sách ghế" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // Memoized seat selection handler
  const handleSeatSelect = useCallback((seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  }, []);

  // Memoized edit handler
  const handleEditSeat = useCallback((seat: SeatDoc) => {
    setEditingSeat(seat);
    setEditValues({
      seatId: seat.seatId,
      status: seat.status,
    });
  }, []);

  // Memoized save function
  const saveEditSeat = useCallback(async () => {
    if (!editingSeat) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/seats/${editingSeat._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });

      if (!response.ok) throw new Error("Failed to update seat");

      toast.success("Cập nhật ghế thành công");
      setEditingSeat(null);
      fetchSeats();
    } catch (error) {
      console.error("Update seat error:", error);
      toast.error("Cập nhật ghế thất bại");
    } finally {
      setSaving(false);
    }
  }, [editingSeat, editValues, fetchSeats]);

  // Memoized bulk action handler
  const handleBulkAction = useCallback(async () => {
    if (!bulkAction || selectedSeats.length === 0) return;

    try {
      setSaving(true);
      const response = await fetch("/api/admin/seats/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatIds: selectedSeats,
          action: bulkAction,
        }),
      });

      if (!response.ok) throw new Error("Failed to perform bulk action");

      toast.success(`Đã cập nhật ${selectedSeats.length} ghế`);
      setSelectedSeats([]);
      setBulkAction("");
      setShowBulkDialog(false);
      fetchSeats();
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error("Thao tác hàng loạt thất bại");
    } finally {
      setSaving(false);
    }
  }, [bulkAction, selectedSeats, fetchSeats]);

  // Memoized reset function
  const resetSeat = useCallback(
    async (seatId: string) => {
      try {
        setSaving(true);
        const seat = [...seats.left, ...seats.right].find(
          (s) => s.seatId === seatId,
        );
        if (!seat) return;

        const response = await fetch(`/api/admin/seats/${seat._id}/reset`, {
          method: "POST",
        });

        if (!response.ok) throw new Error("Failed to reset seat");

        toast.success("Reset ghế thành công");
        fetchSeats();
      } catch (error) {
        console.error("Reset seat error:", error);
        toast.error("Reset ghế thất bại");
      } finally {
        setSaving(false);
      }
    },
    [seats.left, seats.right, fetchSeats],
  );

  // Memoized handlers for UI interactions
  const handleCloseEditDialog = useCallback(() => {
    setEditingSeat(null);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const handleCloseBulkDialog = useCallback(() => {
    setShowBulkDialog(false);
  }, []);

  const handleOpenBulkDialog = useCallback(() => {
    setShowBulkDialog(true);
  }, []);

  // Memoized edit values handlers
  const handleSeatIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditValues((prev) => ({ ...prev, seatId: e.target.value }));
    },
    [],
  );

  const handleStatusChange = useCallback((value: string) => {
    setEditValues((prev) => ({ ...prev, status: value }));
  }, []);

  // Memoized reset handler for edit dialog
  const handleResetFromDialog = useCallback(() => {
    if (editingSeat?.seatId) {
      resetSeat(editingSeat.seatId);
    }
  }, [editingSeat?.seatId, resetSeat]);

  // Memoize selected seats Set for O(1) lookup performance
  const selectedSeatsSet = useMemo(
    () => new Set(selectedSeats),
    [selectedSeats],
  );

  // Memoized function to check if seat is selected
  const isSeatSelected = useCallback(
    (seatId: string) => {
      return selectedSeatsSet.has(seatId);
    },
    [selectedSeatsSet],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sơ đồ chỗ ngồi</h1>
            <p className="mt-1 text-gray-600">Quản lý ghế ngồi và sơ đồ rạp</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Sơ đồ chỗ ngồi</h1>
          <p className="mt-1 text-gray-600">Quản lý ghế ngồi và sơ đồ rạp</p>
        </div>
        <Button onClick={fetchSeats} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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

      {/* Selected Seats Actions */}
      {selectedSeats.length > 0 && (
        <Alert>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Đã chọn {selectedSeats.length} ghế</span>
              <div className="flex items-center gap-2">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Chọn hành động" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="set_available">
                      Đặt trạng thái trống
                    </SelectItem>
                    <SelectItem value="set_reserved">
                      Đặt trạng thái đã đặt
                    </SelectItem>
                    <SelectItem value="release_hold">Hủy giữ chỗ</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleOpenBulkDialog}
                  disabled={!bulkAction}
                  size="sm"
                >
                  Thực hiện
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearSelection}
                  size="sm"
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent>
          <div className="mb-6 flex justify-between gap-4 max-md:flex-col">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-8 rounded-md",
                    renderClassNameColorSeat("available"),
                  )}
                ></div>
                Trống
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-8 rounded-md",
                    renderClassNameColorSeat("held"),
                  )}
                ></div>
                Đang giữ chỗ
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-8 rounded-md",
                    renderClassNameColorSeat("reserved"),
                  )}
                ></div>
                Đã được đặt
              </div>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="overflow-auto py-2">
            <div className="mx-auto grid max-w-3xl min-w-2xl grid-cols-2 gap-8 max-md:overflow-auto">
              <div className="grid grid-cols-5 gap-4">
                {seats.left.map((seat) => (
                  <AdminSeatItem
                    key={seat.seatId}
                    data={seat}
                    onSelect={handleSeatSelect}
                    isSelected={isSeatSelected(seat.seatId)}
                    onEdit={handleEditSeat}
                  />
                ))}
              </div>
              <div className="grid grid-cols-5 gap-4">
                {seats.right.map((seat) => (
                  <AdminSeatItem
                    key={seat.seatId}
                    data={seat}
                    onSelect={handleSeatSelect}
                    isSelected={isSeatSelected(seat.seatId)}
                    onEdit={handleEditSeat}
                  />
                ))}
              </div>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium">
                Đã chọn: {selectedSeats.length} ghế
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Ghế: {selectedSeats.join(", ")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Seat Dialog */}
      <Dialog open={!!editingSeat} onOpenChange={handleCloseEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ghế {editingSeat?.seatId}</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin và trạng thái ghế
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seatId">Số ghế</Label>
              <Input
                id="seatId"
                value={editValues.seatId}
                onChange={handleSeatIdChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={editValues.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Trống</SelectItem>
                  <SelectItem value="held">Đang giữ chỗ</SelectItem>
                  <SelectItem value="reserved">Đã đặt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="destructive"
                onClick={handleResetFromDialog}
                disabled={saving}
              >
                <RefreshCw className="h-4 w-4" />
                Reset ghế
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCloseEditDialog}>
                  Hủy
                </Button>
                <Button onClick={saveEditSeat} disabled={saving}>
                  <Save className="h-4 w-4" />
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={handleCloseBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thao tác</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn thực hiện hành động này cho{" "}
              {selectedSeats.length} ghế đã chọn?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseBulkDialog}>
              Hủy
            </Button>
            <Button onClick={handleBulkAction} disabled={saving}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
