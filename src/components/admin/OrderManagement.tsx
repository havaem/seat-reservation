"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrderDoc } from "@/models/Order";
import { formatDate } from "@/utils/formatDate";
import {
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface OrdersResponse {
  orders: OrderDoc[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDoc | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (
    orderId: string,
    action: "approve" | "reject",
  ) => {
    try {
      setActionLoading(orderId);
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action, reviewNote }),
      });

      if (!response.ok) throw new Error("Failed to update order");

      await fetchOrders(); // Refresh list
      setSelectedOrder(null);
      setReviewNote("");
    } catch (error) {
      console.error("Order action error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_offline: {
        label: "Chờ xử lý",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      paid_offline: {
        label: "Đã thanh toán",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["pending_offline"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const isExpired = (expiresAt: string | Date) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="mt-1 text-gray-600">Xem và xử lý các đơn đặt vé</p>
        </div>
        <Button onClick={fetchOrders} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, SĐT, mã đơn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-[#f88134] focus:outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending_offline">Chờ xử lý</option>
                <option value="paid_offline">Đã thanh toán</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              Tổng:{" "}
              <span className="ml-1 font-medium">
                {pagination.total} đơn hàng
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f88134] border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Không tìm thấy đơn hàng nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left font-medium text-gray-700">
                      Mã đơn
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Khách hàng
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Ghế
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Tổng tiền
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Trạng thái
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Ngày tạo
                    </th>
                    <th className="p-3 text-center font-medium text-gray-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-mono text-sm">
                          {order._id.slice(-8)}
                        </div>
                        {isExpired(order.expiresAt as unknown as string) &&
                          order.status === "pending_offline" && (
                            <div className="text-xs text-red-500">
                              Đã hết hạn
                            </div>
                          )}
                      </td>
                      <td className="p-3">
                        <div className="font-medium">
                          {order.buyer.fullName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.buyer.phone}
                        </div>
                        {order.buyer.email && (
                          <div className="text-sm text-gray-600">
                            {order.buyer.email}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-sm">
                          {order.seatIds.join(", ")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.seatIds.length} ghế
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="p-3">{getStatusBadge(order.status)}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {order.status === "pending_offline" &&
                            !isExpired(order.expiresAt) && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() =>
                                    handleOrderAction(order._id, "approve")
                                  }
                                  disabled={actionLoading === order._id}
                                >
                                  {actionLoading === order._id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleOrderAction(order._id, "reject")
                                  }
                                  disabled={actionLoading === order._id}
                                >
                                  {actionLoading === order._id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              </>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-6">
              <div className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.totalPages}(
                {pagination.total} đơn hàng)
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={!pagination.hasPrev || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={!pagination.hasNext || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <h2 className="text-xl font-bold">Chi tiết đơn hàng</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mã đơn hàng
                    </label>
                    <p className="font-mono">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Thông tin khách hàng
                  </label>
                  <div className="mt-1 rounded bg-gray-50 p-3">
                    <p>
                      <strong>Tên:</strong> {selectedOrder.buyer.fullName}
                    </p>
                    <p>
                      <strong>SĐT:</strong> {selectedOrder.buyer.phone}
                    </p>
                    {selectedOrder.buyer.email && (
                      <p>
                        <strong>Email:</strong> {selectedOrder.buyer.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ghế đã đặt
                  </label>
                  <div className="mt-1 rounded bg-gray-50 p-3">
                    <p className="font-mono">
                      {selectedOrder.seatIds.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.seatIds.length} ghế
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tổng tiền
                    </label>
                    <p className="text-lg font-bold text-[#f88134]">
                      {formatCurrency(selectedOrder.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <p>{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Hết hạn lúc
                  </label>
                  <p
                    className={
                      isExpired(selectedOrder.expiresAt)
                        ? "font-medium text-red-600"
                        : ""
                    }
                  >
                    {formatDate(selectedOrder.expiresAt)}
                  </p>
                </div>

                {selectedOrder.reviewNote && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Ghi chú xử lý
                    </label>
                    <p className="mt-1 rounded bg-gray-50 p-3">
                      {selectedOrder.reviewNote}
                    </p>
                  </div>
                )}

                {selectedOrder.status === "pending_offline" &&
                  !isExpired(selectedOrder.expiresAt) && (
                    <div className="border-t pt-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Ghi chú xử lý (tùy chọn)
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Nhập ghi chú cho quyết định xử lý..."
                        className="w-full resize-none rounded-md border border-gray-300 p-3"
                        rows={3}
                      />

                      <div className="mt-4 flex space-x-3">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleOrderAction(selectedOrder._id, "approve")
                          }
                          disabled={actionLoading === selectedOrder._id}
                        >
                          {actionLoading === selectedOrder._id ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Duyệt đơn hàng
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() =>
                            handleOrderAction(selectedOrder._id, "reject")
                          }
                          disabled={actionLoading === selectedOrder._id}
                        >
                          {actionLoading === selectedOrder._id ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <X className="mr-2 h-4 w-4" />
                          )}
                          Từ chối đơn hàng
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
