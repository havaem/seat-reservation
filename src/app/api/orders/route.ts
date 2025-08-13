import { EVENT } from "@/config/event";
import { dbConnect } from "@/lib/db";
import { withIdempotency } from "@/lib/idempotency";
import { makeBankContent, suggestionFrom } from "@/lib/utils";
import { Hold } from "@/models/Hold";
import { Order } from "@/models/Order";
import { Seat } from "@/models/Seat";
import mongoose from "mongoose";

export async function POST(req: Request) {
  return withIdempotency(req, async () => {
    const body = await req.json();
    const { holdId, buyer, method } = body;
    if (!holdId || method !== "manual_bank") return new Response("Bad request", { status: 400 });
    await dbConnect();

    const hold = await Hold.findById(holdId);
    if (!hold) return new Response(JSON.stringify({ code: "HOLD_NOT_FOUND" }), { status: 404 });
    if (hold.expiresAt < new Date()) return new Response(JSON.stringify({ code: "HOLD_EXPIRED" }), { status: 410 });

    const seats = await Seat.find({ seatId: { $in: hold.seatIds } });
    const priceByCode = new Map(EVENT.pricingTiers.map((t) => [t.code, t.price] as const));
    const amount = seats.reduce((sum, s) => sum + (priceByCode.get(s.tierCode) || 0), 0);

    const orderId = new mongoose.Types.ObjectId().toString();
    const bankContent = makeBankContent(EVENT.code, orderId, buyer.fullName || "GUEST");
    const amountSuggestion = suggestionFrom(orderId, amount);

    const ttlMin = parseInt(process.env.ORDER_TTL_MIN || "30");
    const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);

    await Order.create({
      _id: orderId,
      seatIds: hold.seatIds,
      amount,
      amountSuggestion,
      bankContent,
      buyer,
      method: "manual_bank",
      status: "pending_offline",
      expiresAt,
    });

    return new Response(
      JSON.stringify({
        orderId,
        status: "pending_offline",
        amount,
        expiresAt,
        bankHint: {
          accountName: process.env.BANK_ACC_NAME,
          accountNumber: process.env.BANK_ACC_NUMBER,
          bank: process.env.BANK_NAME,
          content: bankContent,
          amountSuggestion,
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  });
}