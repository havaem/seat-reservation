import { HoldCreateRequestSchema, HoldCreateResponseSchema } from "@/types/api";
import { dbConnect } from "@/lib/db";
import { withIdempotency } from "@/lib/idempotency";
import { Hold } from "@/models/Hold";
import { Seat } from "@/models/Seat";
import mongoose from "mongoose";

export async function POST(req: Request) {
  return withIdempotency(req, async () => {
    const body = HoldCreateRequestSchema.parse(await req.json());
    await dbConnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    const ttlMin = Number(process.env.HOLD_TTL_MIN) || 10;
    const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);

    try {
      const seatsToHold = body.seats;
      const seatUpdate = await Seat.updateMany(
        { seatId: { $in: seatsToHold }, status: "available" },
        { $set: { status: "held" } },
        { session },
      );
      if (seatUpdate.modifiedCount !== seatsToHold.length) {
        await Seat.updateMany(
          { seatId: { $in: seatsToHold }, status: "held" },
          { $set: { status: "available", holdId: null } },
          { session },
        );
        await session.abortTransaction();
        session.endSession();
        return new Response(JSON.stringify({ code: "SEAT_ALREADY_HELD" }), {
          status: 409,
          headers: { "content-type": "application/json" },
        });
      }

      const holdId = new mongoose.Types.ObjectId().toString();
      await Hold.create(
        [{ _id: holdId, seatIds: seatsToHold, total: 0, expiresAt }],
        { session },
      );
      await Seat.updateMany(
        { seatId: { $in: seatsToHold } },
        { $set: { holdId } },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      const payload = HoldCreateResponseSchema.parse({
        holdId,
        seats: seatsToHold,
        expiresAt: expiresAt.toISOString(),
      });

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } catch {
      await session.abortTransaction();
      session.endSession();
      return new Response("Conflict", { status: 409 });
    }
  });
}
