import { clearCache } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import { validateCronAuth, createUnauthorizedResponse } from "@/lib/cronAuth";

export async function GET(request: NextRequest) {
  // Validate cron authorization
  if (!validateCronAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    // Force cleanup expired cache entries
    clearCache();

    return NextResponse.json({
      success: true,
      message: "Cache cleanup completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cache cleanup error:", error);
    return NextResponse.json(
      { success: false, error: "Cache cleanup failed" },
      { status: 500 },
    );
  }
}
