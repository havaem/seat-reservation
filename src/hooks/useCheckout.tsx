import {
  createHold,
  createOrder,
  getInstructions,
  uploadProof,
} from "@/app/apiClient";
import { idemp } from "@/lib/idemClient";
import { OrderItem } from "@/models/Order";
import { useCallback, useEffect, useRef, useState } from "react";

type Buyer = { fullName: string; phone: string; email?: string };

// LocalStorage keys
const STORAGE_KEYS = {
  ORDER_ID: "checkout_order_id",
  ORDER_EXPIRES_AT: "checkout_order_expires_at",
  BANK_INFO: "checkout_bank_info",
} as const;

const saveToStorage = (key: string, value: unknown) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = <T = unknown,>(key: string): T | null => {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return null;
  }
};

const removeFromStorage = (key: string) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn("Failed to remove from localStorage:", error);
  }
};

export type TCheckoutStep = "select" | "holding" | "pay" | "done";
export type TBankInfo = {
  content: string;
  amount: number;
  accountName: string;
  accountNumber: string;
  bank: string;
};

export function useCheckout() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<TCheckoutStep>("select");
  const [error, setError] = useState<string | null>(null);

  const hold = useRef<{ holdId: string; expiresAt: string } | null>(null);
  const order = useRef<{ orderId: string; expiresAt: string } | null>(null);
  const bank = useRef<TBankInfo | null>(null);

  const clearStoredOrder = useCallback(() => {
    removeFromStorage(STORAGE_KEYS.ORDER_ID);
    removeFromStorage(STORAGE_KEYS.ORDER_EXPIRES_AT);
    removeFromStorage(STORAGE_KEYS.BANK_INFO);
  }, []);

  const refreshInstructionsFromStorage = useCallback(
    async (orderId: string) => {
      try {
        const res = await getInstructions(orderId);
        bank.current = {
          ...res.bankHint,
          amount: res.amount,
        };
        order.current = { orderId, expiresAt: res.expiresAt };

        // Cập nhật localStorage với thông tin mới
        saveToStorage(STORAGE_KEYS.ORDER_EXPIRES_AT, res.expiresAt);
        saveToStorage(STORAGE_KEYS.BANK_INFO, bank.current);
      } catch (error) {
        console.warn("Failed to refresh instructions:", error);
        // Nếu không lấy được instructions, có thể order đã hết hạn hoặc không tồn tại
        clearStoredOrder();
        setStep("select");
      }
    },
    [clearStoredOrder],
  );

  // Khôi phục trạng thái từ localStorage khi component mount
  useEffect(() => {
    const savedOrderId = loadFromStorage<string>(STORAGE_KEYS.ORDER_ID);
    const savedExpiresAt = loadFromStorage<string>(
      STORAGE_KEYS.ORDER_EXPIRES_AT,
    );
    const savedBankInfo = loadFromStorage<typeof bank.current>(
      STORAGE_KEYS.BANK_INFO,
    );

    if (savedOrderId && savedExpiresAt) {
      // Kiểm tra nếu order chưa hết hạn
      const expiresAt = new Date(savedExpiresAt).getTime();
      const now = Date.now();

      if (expiresAt > now) {
        // Khôi phục trạng thái
        order.current = { orderId: savedOrderId, expiresAt: savedExpiresAt };
        if (savedBankInfo) {
          bank.current = savedBankInfo;
        }
        setStep("done");

        // Tự động refresh instructions để có thông tin mới nhất
        refreshInstructionsFromStorage(savedOrderId);
      } else {
        // Order đã hết hạn, xóa khỏi storage
        clearStoredOrder();
      }
    }
  }, [clearStoredOrder, refreshInstructionsFromStorage]);

  const getRemainingMs = useCallback(() => {
    const iso = order.current?.expiresAt ?? hold.current?.expiresAt;
    return iso ? Math.max(0, new Date(iso).getTime() - Date.now()) : 0;
  }, []);

  const startHold = useCallback(async (seats: string[]) => {
    setIsLoading(true);
    setError(null);
    setStep("holding");
    try {
      const res = await createHold(seats, idemp.get("hold"));
      idemp.clear("hold");
      hold.current = { holdId: res.holdId, expiresAt: res.expiresAt };
      setStep("pay");
      return res;
    } catch (e: unknown) {
      // e.code có thể là "SEAT_ALREADY_HELD"
      setError((e as { code?: string })?.code || "Giữ chỗ thất bại");
      setStep("select");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async (buyer: Buyer, items: OrderItem[]) => {
    if (!hold.current) throw new Error("Missing hold");
    setIsLoading(true);
    setError(null);
    try {
      const res = await createOrder(
        hold.current.holdId,
        buyer,
        items,
        idemp.get("order"),
      );
      idemp.clear("order");
      order.current = { orderId: res.orderId, expiresAt: res.expiresAt };
      bank.current = {
        ...res.bankHint,
        amount: res.amount,
      };

      // Lưu trạng thái vào localStorage
      saveToStorage(STORAGE_KEYS.ORDER_ID, res.orderId);
      saveToStorage(STORAGE_KEYS.ORDER_EXPIRES_AT, res.expiresAt);
      saveToStorage(STORAGE_KEYS.BANK_INFO, bank.current);

      setStep("done");
      return res;
    } catch (e: unknown) {
      setError((e as { code?: string })?.code || "Tạo đơn thất bại");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshInstructions = useCallback(async () => {
    if (!order.current) return null;
    const res = await getInstructions(order.current.orderId);
    bank.current = {
      ...res.bankHint,
      amount: res.amount,
    };
    order.current.expiresAt = res.expiresAt;

    // Cập nhật localStorage với thông tin mới
    saveToStorage(STORAGE_KEYS.ORDER_EXPIRES_AT, res.expiresAt);
    saveToStorage(STORAGE_KEYS.BANK_INFO, bank.current);

    return res;
  }, []);

  const submitProof = useCallback(async (file: File) => {
    if (!order.current) throw new Error("Missing order");
    return uploadProof(order.current.orderId, file, idemp.get("proof"));
  }, []);

  return {
    isLoading,
    step,
    error,
    getRemainingMs,
    hold: hold.current,
    order: order.current,
    bank: bank.current,
    startHold,
    placeOrder,
    refreshInstructions,
    submitProof,
    clearStoredOrder,
  };
}
