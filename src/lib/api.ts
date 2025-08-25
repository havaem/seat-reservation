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
  stats: {
    totalSeats: number;
    availableSeats: number;
    reservedSeats: number;
    heldSeats: number;
    totalOrders: number;
    totalRevenue: number;
    occupancyRate: number;
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

  async getAdminOrders(params: URLSearchParams): Promise<{
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
      createdAt: string;
      seatIds: string[];
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    const response = await fetch(`/api/admin/orders?${params}`);
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
