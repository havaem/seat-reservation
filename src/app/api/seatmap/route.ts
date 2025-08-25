import { NextResponse } from "next/server";
import { EVENT } from "@/config/event";
import { dbConnect } from "@/lib/db";
import { Seat } from "@/models/Seat";
import { checkRateLimit, getRateLimitResponse } from "@/lib/rateLimit";
import { getCached, setCache } from "@/lib/cache";

export async function GET(req: Request) {
  try {
    // Rate limiting for seatmap
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip, 20, 60000)) {
      // 30 requests per minute
      return getRateLimitResponse();
    }

    // Check cache first
    const cacheKey = "seatmap-data";
    const cached = getCached<{
      pricingTiers: typeof EVENT.pricingTiers;
      seats: unknown[];
    }>(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    await dbConnect();
    const seats = await Seat.find({}).lean();

    const response = {
      pricingTiers: EVENT.pricingTiers,
      seats,
    };

    // Cache for 10 seconds to reduce DB load
    setCache(cacheKey, response, 10000);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching seat map:", error);
    return new NextResponse("Error fetching seat map", { status: 500 });
  }
}
