import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Seat } from "@/models/Seat";
import { NextResponse } from "next/server";

export async function GET() {
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
