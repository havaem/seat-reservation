// Centralized query keys for TanStack Query
export const queryKeys = {
  // Settings
  settings: {
    all: ["settings"] as const,
    public: () => [...queryKeys.settings.all, "public"] as const,
  },

  // Seats
  seats: {
    all: ["seats"] as const,
    map: () => [...queryKeys.seats.all, "map"] as const,
    stats: () => [...queryKeys.seats.all, "stats"] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.orders.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
    instructions: (id: string) =>
      [...queryKeys.orders.all, "instructions", id] as const,
  },

  // Admin
  admin: {
    all: ["admin"] as const,
    dashboard: () => [...queryKeys.admin.all, "dashboard"] as const,
    orders: (filters?: Record<string, unknown>) =>
      [...queryKeys.admin.all, "orders", filters] as const,
  },

  // Queue
  queue: {
    all: ["queue"] as const,
    status: () => [...queryKeys.queue.all, "status"] as const,
  },

  // Auth
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
} as const;
