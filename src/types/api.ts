import { z } from "zod";
export const HoldCreateRequestSchema = z.object({
  seats: z.array(z.string().min(1)).nonempty(),
});
export const HoldCreateResponseSchema = z.object({
  holdId: z.string(),
  seats: z.array(z.string()),
  expiresAt: z.string(),
});
export const OrderCreateRequestSchema = z.object({
  holdId: z.string(),
  method: z.literal("manual_bank"),
  buyer: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(6),
    email: z.string().email().optional(),
  }),
});
export const OrderCreateResponseSchema = z.object({
  orderId: z.string(),
  status: z.literal("pending_offline"),
  amount: z.number().int().nonnegative(),
  expiresAt: z.string(),
  bankHint: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    bank: z.string(),
    content: z.string(),
  }),
});
export const OrderInstructionsResponseSchema = z.object({
  orderId: z.string(),
  status: z.union([
    z.literal("pending_offline"),
    z.literal("paid_offline"),
    z.literal("cancelled"),
    z.literal("expired"),
  ]),
  amount: z.number().int().nonnegative(),
  expiresAt: z.string(),
  bankHint: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    bank: z.string(),
    content: z.string(),
  }),
});
export const AdminReviewRequestSchema = z.object({
  decision: z.union([z.literal("approve"), z.literal("reject")]),
  reviewNote: z.string().optional(),
  reviewedBy: z.string().optional(),
  paidAmount: z.number().int().positive().optional(),
});
export const AdminReviewResponseSchema = z.object({
  orderId: z.string(),
  status: z.union([z.literal("paid_offline"), z.literal("cancelled")]),
  paidAt: z.string().optional(),
});
export type HoldCreateRequest = z.infer<typeof HoldCreateRequestSchema>;
export type HoldCreateResponse = z.infer<typeof HoldCreateResponseSchema>;
export type OrderCreateRequest = z.infer<typeof OrderCreateRequestSchema>;
export type OrderCreateResponse = z.infer<typeof OrderCreateResponseSchema>;
export type OrderInstructionsResponse = z.infer<
  typeof OrderInstructionsResponseSchema
>;
export type AdminReviewRequest = z.infer<typeof AdminReviewRequestSchema>;
export type AdminReviewResponse = z.infer<typeof AdminReviewResponseSchema>;
