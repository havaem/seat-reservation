import { ENV } from "@/config/env";
import { EVENT } from "@/config/event";
import { dbConnect } from "@/lib/db";
import { withIdempotency } from "@/lib/idempotency";
import { makeBankContent } from "@/lib/utils";
import { Hold } from "@/models/Hold";
import { Order } from "@/models/Order";
import { Seat } from "@/models/Seat";
import {
  OrderCreateRequestSchema,
  OrderCreateResponseSchema,
} from "@/types/api";
import mongoose from "mongoose";
export async function POST(req: Request) {
  return withIdempotency(req, async () => {
    const body = OrderCreateRequestSchema.parse(await req.json());
    await dbConnect();
    const hold = await Hold.findById(body.holdId);
    if (!hold)
      return new Response(JSON.stringify({ code: "HOLD_NOT_FOUND" }), {
        status: 404,
      });
    if (hold.expiresAt < new Date())
      return new Response(JSON.stringify({ code: "HOLD_EXPIRED" }), {
        status: 410,
      });

    const seats = await Seat.find({ seatId: { $in: hold.seatIds } });
    const priceByCode = new Map(
      EVENT.pricingTiers.map((t) => [t.code, t.price] as const),
    );
    const amount = seats.reduce(
      (sum, s) => sum + (priceByCode.get(s.tierCode) || 0),
      0,
    );

    const orderId = new mongoose.Types.ObjectId().toString();
    const bankContent = makeBankContent(
      EVENT.code,
      orderId,
      body.buyer.fullName,
    );

    const ttlMin = parseInt(process.env.ORDER_TTL_MIN || "30");
    const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);

    await Order.create({
      _id: orderId,
      seatIds: hold.seatIds,
      amount,
      bankContent,
      buyer: body.buyer,
      method: "manual_bank",
      status: "pending_offline",
      expiresAt,
    });

    const payload = OrderCreateResponseSchema.parse({
      orderId,
      status: "pending_offline",
      amount,
      expiresAt: expiresAt.toISOString(),
      bankHint: {
        accountName: ENV.BANK_ACC_NAME,
        accountNumber: ENV.BANK_ACC_NUMBER,
        bank: ENV.BANK_NAME,
        content: bankContent,
      },
    });
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
}
