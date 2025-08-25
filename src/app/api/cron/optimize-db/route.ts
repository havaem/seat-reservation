import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Cleanup old completed orders (paid_offline or cancelled) older than 30 days
    const result = await Order.deleteMany({
      status: { $in: ["paid_offline", "cancelled", "expired"] },
      createdAt: { $lt: thirtyDaysAgo },
    });

    return NextResponse.json({
      success: true,
      deletedOrders: result.deletedCount,
      message: "Database optimization completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database optimization error:", error);
    return NextResponse.json(
      { success: false, error: "Database optimization failed" },
      { status: 500 },
    );
  }
}
