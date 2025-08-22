import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Seat } from "@/models/Seat";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    await dbConnect();

    const body = await request.json();
    const { seatIds, action } = body;

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid seat IDs array" },
        { status: 400 },
      );
    }

    const seats = await Seat.find({ seatId: { $in: seatIds } });

    if (seats.length === 0) {
      return NextResponse.json({ error: "No seats found" }, { status: 404 });
    }

    // Apply bulk action
    for (const seat of seats) {
      switch (action) {
        case "set_available":
          seat.status = "available";
          seat.holdExpiresAt = undefined;
          seat.reservedBy = undefined;
          break;
        case "set_reserved":
          seat.status = "reserved";
          break;
        case "release_hold":
          if (seat.status === "held") {
            seat.status = "available";
            seat.holdExpiresAt = undefined;
          }
          break;
        default:
          return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 },
          );
      }
      await seat.save();
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${seats.length} seats`,
      updatedSeats: seats.length,
    });
  } catch (error) {
    console.error("Bulk action error:", error);
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
