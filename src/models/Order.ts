import { Schema, model, models } from "mongoose";

export type OrderItem = { seatId: string; tierCode: string };
export interface OrderDoc {
  _id: string;
  seatIds: string[];
  items: OrderItem[];
  amount: number;
  bankContent: string;
  buyer: { fullName: string; email?: string; phone: string };
  method: "manual_bank";
  status: "pending_offline" | "paid_offline" | "cancelled" | "expired";
  expiresAt: Date;
  paidAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNote?: string;
  paidAmount?: number;
}

const OrderSchema = new Schema<OrderDoc>(
  {
    _id: { type: String, required: true },
    seatIds: [{ type: String, required: true }],
    items: [{ seatId: String, tierCode: String }],
    amount: { type: Number, required: true },
    bankContent: { type: String, unique: true, index: true, required: true },
    buyer: {
      fullName: { type: String, required: true },
      email: String,
      phone: { type: String, required: true },
    },
    method: {
      type: String,
      enum: ["manual_bank"],
      default: "manual_bank",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_offline", "paid_offline", "cancelled", "expired"],
      index: true,
      required: true,
    },
    expiresAt: { type: Date, index: true, required: true },
    paidAt: Date,
    reviewedBy: String,
    reviewedAt: Date,
    reviewNote: String,
    paidAmount: Number,
  },
  { timestamps: true },
);

export const Order = models.Order || model<OrderDoc>("Order", OrderSchema);
