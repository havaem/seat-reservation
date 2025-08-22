import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Seat } from "@/models/Seat";
import { requireAdmin } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    await dbConnect();

    const { id } = params;

    const seat = await Seat.findById(id);
    if (!seat) {
      return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    }

    // Reset seat to available
    seat.status = "available";
    seat.holdExpiresAt = undefined;
    seat.reservedBy = undefined;

    await seat.save();

    return NextResponse.json({ success: true, seat });
  } catch (error) {
    console.error("Reset seat error:", error);
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
