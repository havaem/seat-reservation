import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Seat } from "@/models/Seat";

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();

    // Get statistics
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      totalRevenue,
      totalSeats,
      availableSeats,
      reservedSeats,
      heldSeats,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "pending_offline" }),
      Order.countDocuments({ status: "paid_offline" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.aggregate([
        { $match: { status: "paid_offline" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then((result) => result[0]?.total || 0),
      Seat.countDocuments(),
      Seat.countDocuments({ status: "available" }),
      Seat.countDocuments({ status: "reserved" }),
      Seat.countDocuments({ status: "held" }),
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get orders by day for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const orderCount = await Order.countDocuments({
        createdAt: { $gte: date, $lt: nextDay },
      });

      last7Days.push({
        date: date.toISOString().split("T")[0],
        orders: orderCount,
      });
    }

    return NextResponse.json({
      overview: {
        totalOrders,
        pendingOrders,
        paidOrders,
        cancelledOrders,
        totalRevenue,
        occupancyRate: Math.round((reservedSeats / totalSeats) * 100),
      },
      seats: {
        total: totalSeats,
        available: availableSeats,
        reserved: reservedSeats,
        held: heldSeats,
      },
      recentOrders,
      ordersByDay: last7Days,
    });
  } catch (error: unknown) {
    console.error("Get dashboard stats error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      errorMessage === "Authentication required" ||
      errorMessage === "Admin access required"
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thống kê" },
      { status: 500 },
    );
  }
}
