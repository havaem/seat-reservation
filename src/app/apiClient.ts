import { z } from "zod";
import { get, post } from "@/config/axios";

/** Schemas tối thiểu để parse response */
const HoldRes = z.object({
  holdId: z.string(),
  seats: z.array(z.string()),
  expiresAt: z.string(),
});
const OrderRes = z.object({
  orderId: z.string(),
  status: z.literal("pending_offline"),
  amount: z.number(),
  expiresAt: z.string(),
  bankHint: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    bank: z.string(),
    content: z.string(),
  }),
});
const InstructionsRes = OrderRes.extend({
  orderId: z.string(),
  status: z.union([
    z.literal("pending_offline"),
    z.literal("paid_offline"),
    z.literal("cancelled"),
    z.literal("expired"),
  ]),
});

export async function createHold(seats: string[], idemKey: string) {
  const data = await post(
    "/api/holds",
    { seats },
    {
      headers: {
        "Idempotency-Key": idemKey,
      },
    },
  );
  return HoldRes.parse(data);
}

export async function createOrder(
  holdId: string,
  buyer: { fullName: string; phone: string; email?: string },
  idemKey: string,
) {
  const data = await post(
    "/api/orders",
    { holdId, method: "manual_bank", buyer },
    {
      headers: {
        "Idempotency-Key": idemKey,
      },
    },
  );
  return OrderRes.parse(data);
}

export async function getInstructions(orderId: string) {
  const data = await get(`/api/orders/${orderId}/instructions`);
  return InstructionsRes.parse(data);
}

export async function uploadProof(
  orderId: string,
  file: File,
  idemKey: string,
) {
  const fd = new FormData();
  fd.append("file", file);

  const response = await fetch(`/api/orders/${orderId}/proof`, {
    method: "POST",
    headers: { "Idempotency-Key": idemKey },
    body: fd,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json() as Promise<{ attachmentId: string; url: string }>;
}

export async function cancelOrder(orderId: string) {
  const data = await post(`/api/orders/${orderId}/cancel`, {});
  return data as unknown as { ok: true };
}
