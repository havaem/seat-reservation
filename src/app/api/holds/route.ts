import { dbConnect } from "@/lib/db";
import { withIdempotency } from "@/lib/idempotency";
import { Seat } from "@/models/Seat";
import { Hold } from "@/models/Hold";
import mongoose from "mongoose";

export async function POST(req: Request) {
  return withIdempotency(req, async () => {
    const { seats } = await req.json();
    if (!Array.isArray(seats) || seats.length === 0) return new Response("Bad request", { status: 400 });
    await dbConnect();

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const ttlMin = parseInt(process.env.HOLD_TTL_MIN || "10");
      const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);

      const upd = await Seat.updateMany({ seatId: { $in: seats }, status: "available" }, { $set: { status: "held" } }, { session });
      if (upd.modifiedCount !== seats.length) {
        await session.abortTransaction();
        session.endSession();
        return new Response(JSON.stringify({ code: "SEAT_ALREADY_HELD" }), { status: 409, headers: { "content-type": "application/json" } });
      }

      const holdId = new mongoose.Types.ObjectId().toString();
      await Hold.create([{ _id: holdId, seatIds: seats, total: 0, expiresAt }], { session });
      await Seat.updateMany({ seatId: { $in: seats } }, { $set: { holdId } }, { session });

      await session.commitTransaction();
      session.endSession();
      return new Response(JSON.stringify({ holdId, seats, expiresAt }), { status: 200, headers: { "content-type": "application/json" } });
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      return new Response("Conflict", { status: 409 });
    }
  });
}