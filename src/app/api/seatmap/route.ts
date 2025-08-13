import { dbConnect } from "@/lib/db";
import { Seat, SeatDoc } from "@/models/Seat";
import { EVENT } from "@/config/event";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHODS } from "next/dist/server/web/http";

export async function GET() {
  await dbConnect();

  const seats = await Seat.find({}, { _id: 0 }).lean();

    //  import seat
    const seatTs:SeatDoc[] = [];
for (let i = 1; i <= 20; i++) {
  seatTs.push({
    seatId: `A1${i}`,
    status: "available",
    tierCode: "STD",
  });
}
    await Seat.insertMany(seatTs)

  return new Response(JSON.stringify({ pricingTiers: EVENT.pricingTiers, seats }), { headers: { "content-type": "application/json" } });
}
