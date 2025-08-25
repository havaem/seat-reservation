import { clearCache } from "@/lib/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
