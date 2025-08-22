import { NextResponse } from "next/server";
import { EVENT } from "@/config/event";
import { dbConnect } from "@/lib/db";
import { Seat } from "@/models/Seat";

export async function GET() {
  try {
    await dbConnect();
    const seats = await Seat.find({}).lean();
    return NextResponse.json({
      pricingTiers: EVENT.pricingTiers,
      seats,
    });
  } catch (error) {
    console.error("Error fetching seat map:", error);
    return new NextResponse("Error fetching seat map", { status: 500 });
  }
}
