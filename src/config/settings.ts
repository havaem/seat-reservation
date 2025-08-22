export const SETTING_KEYS = {
  // Booking Settings
  BOOKING_ENABLED: "bookingEnabled",
  MAX_SEATS_PER_ORDER: "maxSeatsPerOrder",

  // System Settings
  MAINTENANCE_MODE: "maintenanceMode",
} as const;

export const DEFAULT_SETTINGS = {
  [SETTING_KEYS.BOOKING_ENABLED]: true,
  [SETTING_KEYS.MAX_SEATS_PER_ORDER]: 10,
  [SETTING_KEYS.MAINTENANCE_MODE]: false,
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
export type SettingValue = boolean | number | string | null;

export interface AppSettings {
  [SETTING_KEYS.BOOKING_ENABLED]: boolean;
  [SETTING_KEYS.MAX_SEATS_PER_ORDER]: number;
  [SETTING_KEYS.MAINTENANCE_MODE]: boolean;
}

// Setting metadata for UI generation
export const SETTING_METADATA = {
  [SETTING_KEYS.BOOKING_ENABLED]: {
    name: "Cho phép đặt vé",
    description:
      "Bật/tắt tính năng đặt vé trên website. Khi tắt, khách hàng sẽ không thể đặt vé mới.",
    type: "boolean" as const,
    category: "booking",
    isPublic: true,
  },
  [SETTING_KEYS.MAX_SEATS_PER_ORDER]: {
    name: "Số ghế tối đa mỗi đơn",
    description:
      "Giới hạn số lượng ghế tối đa mà một khách hàng có thể đặt trong một lần.",
    type: "number" as const,
    category: "booking",
    isPublic: true,
    min: 1,
    max: 50,
  },
  [SETTING_KEYS.MAINTENANCE_MODE]: {
    name: "Chế độ bảo trì",
    description:
      "Bật chế độ bảo trì để hiển thị thông báo bảo trì cho người dùng.",
    type: "boolean" as const,
    category: "system",
    isPublic: false,
  },
} as const;

// Helper functions
export function getSettingMetadata(key: SettingKey) {
  return SETTING_METADATA[key];
}

export function getDefaultValue(key: SettingKey): SettingValue {
  return DEFAULT_SETTINGS[key];
}

export function getPublicSettings(): SettingKey[] {
  return Object.keys(SETTING_METADATA).filter(
    (key) => SETTING_METADATA[key as SettingKey].isPublic,
  ) as SettingKey[];
}

export function getSettingsByCategory(category: string): SettingKey[] {
  return Object.keys(SETTING_METADATA).filter(
    (key) => SETTING_METADATA[key as SettingKey].category === category,
  ) as SettingKey[];
}
