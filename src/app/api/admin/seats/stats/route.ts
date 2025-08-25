import { requireAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Seat } from "@/models/Seat";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Verify admin authentication
    await requireAdmin();

    await dbConnect();

    // Get all seats and calculate stats
    const seats = await Seat.find({});

    const stats = {
      total: seats.length,
      available: seats.filter((seat) => seat.status === "available").length,
      reserved: seats.filter((seat) => seat.status === "reserved").length,
      held: seats.filter((seat) => seat.status === "held").length,
      revenue: 0,
      occupancyRate: 0,
    };

    // Calculate revenue from reserved seats
    const reservedSeats = seats.filter((seat) => seat.status === "reserved");
    stats.revenue = reservedSeats.reduce((total, seat) => {
      // Get pricing tiers to calculate price
      const pricingTiers = {
        NORMAL: 150000,
        VIP: 300000,
      };
      const price =
        pricingTiers[seat.tierCode as keyof typeof pricingTiers] || 0;
      return total + price;
    }, 0);

    // Calculate occupancy rate
    if (stats.total > 0) {
      stats.occupancyRate = Math.round((stats.reserved / stats.total) * 100);
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
