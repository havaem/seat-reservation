// API functions for TanStack Query
import { DEFAULT_SETTINGS } from "@/config/settings";

export interface BookingSettings {
  bookingEnabled: boolean;
  maxSeatsPerOrder: number;
}

export interface SeatMapData {
  pricingTiers: Array<{
    code: string;
    name: string;
    price: number;
    color: string;
  }>;
  seats: Array<{
    _id: string;
    seatId: string;
    status: "available" | "held" | "reserved";
    holdId?: string | null;
    orderId?: string | null;
  }>;
}

export interface QueueStatus {
  canAccess: boolean;
  position: number;
  estimatedWaitTime: number;
  queueLength?: number;
}

export interface AdminDashboardData {
  overview: {
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    occupancyRate: number;
  };
  seats: {
    total: number;
    available: number;
    reserved: number;
    held: number;
  };
  recentOrders: Array<{
    _id: string;
    orderId: string;
    buyer: {
      fullName: string;
      phone: string;
      email?: string;
    };
    amount: number;
    status: string;
    createdAt: string;
  }>;
  ordersByDay: Array<{
    date: string;
    orders: number;
  }>;
}

export interface AdminOrdersData {
  orders: Array<{
    _id: string;
    orderId: string;
    buyer: {
      fullName: string;
      phone: string;
      email?: string;
    };
    amount: number;
    status: string;
    seatIds: string[];
    bankContent?: string;
    createdAt: string;
    expiresAt: string;
    paidAt?: string;
    reviewNote?: string;
    reviewedAt?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AdminSeatsStatsData {
  stats: {
    total: number;
    available: number;
    reserved: number;
    held: number;
    revenue: number;
    occupancyRate: number;
  };
}

export interface AdminSettingsData {
  settings: Record<string, unknown>;
}

export interface AdminBulkActionResponse {
  success: boolean;
  message: string;
  updatedSeats: number;
}

export interface AdminOrderActionResponse {
  success: boolean;
  message: string;
  order: {
    _id: string;
    status: string;
    reviewNote?: string;
    reviewedAt?: string;
  };
}

// API Functions
export const apiClient = {
  // Settings
  async getPublicSettings(): Promise<BookingSettings> {
    const response = await fetch("/api/settings/public");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      bookingEnabled: data.bookingEnabled ?? DEFAULT_SETTINGS.bookingEnabled,
      maxSeatsPerOrder:
        data.maxSeatsPerOrder ?? DEFAULT_SETTINGS.maxSeatsPerOrder,
    };
  },

  // Seats
  async getSeatMap(): Promise<SeatMapData> {
    const response = await fetch("/api/seatmap");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // Queue
  async getQueueStatus(): Promise<QueueStatus> {
    const response = await fetch("/api/queue/status");
    const data = await response.json();

    if (response.status === 429) {
      // User is in queue
      return {
        canAccess: false,
        ...data,
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  },

  // Admin
  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response = await fetch("/api/admin/dashboard");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async getAdminOrders(params: URLSearchParams): Promise<AdminOrdersData> {
    const response = await fetch(`/api/admin/orders?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async updateOrderStatus(
    orderId: string,
    action: "approve" | "reject",
    reviewNote?: string,
  ): Promise<AdminOrderActionResponse> {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, action, reviewNote }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async getSeatsStats(): Promise<AdminSeatsStatsData> {
    const response = await fetch("/api/admin/seats/stats");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async bulkUpdateSeats(
    seatIds: string[],
    action: "set_available" | "set_reserved" | "release_hold",
  ): Promise<AdminBulkActionResponse> {
    const response = await fetch("/api/admin/seats/bulk", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seatIds, action }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async updateSeatStatus(
    seatId: string,
    status: "available" | "reserved" | "held",
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/admin/seats/${seatId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async resetSeat(
    seatId: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/admin/seats/${seatId}/reset`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async getAdminSettings(): Promise<AdminSettingsData> {
    const response = await fetch("/api/admin/settings");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async updateSetting(
    key: string,
    value: unknown,
  ): Promise<{
    success: boolean;
    message: string;
    setting: { key: string; value: unknown };
  }> {
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // Auth
  async getSession(): Promise<{
    isAuthenticated: boolean;
    user?: {
      id: string;
      username: string;
    };
  }> {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      return { isAuthenticated: false };
    }
    return response.json();
  },
};
