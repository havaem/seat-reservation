import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { validateCronAuth, createUnauthorizedResponse } from "@/lib/cronAuth";

export async function GET(request: NextRequest) {
  // Validate cron authorization
  if (!validateCronAuth(request)) {
    return createUnauthorizedResponse();
  }

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
