import { NextRequest, NextResponse } from "next/server";
import { Seat } from "@/models/Seat";
import { Order } from "@/models/Order";
import { dbConnect } from "@/lib/db";

export async function GET(req: NextRequest) {
  await dbConnect();
  const now = new Date();

  const expiredOrders = await Order.find({
    status: "pending_offline",
    expiresAt: { $lt: now },
  });

  for (const order of expiredOrders) {
    await Seat.updateMany(
      { seatId: { $in: order.seatIds } },
      { $set: { status: "available" } },
    );
    order.status = "cancelled";
    await order.save();
  }

  return NextResponse.json({ released: expiredOrders.length });
}
