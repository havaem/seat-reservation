import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Seat } from "@/models/Seat";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      released: expiredOrders.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Release expired orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to release expired orders" },
      { status: 500 },
    );
  }
}
