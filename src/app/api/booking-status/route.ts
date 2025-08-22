import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { SETTING_KEYS, DEFAULT_SETTINGS } from "@/config/settings";

export async function GET() {
  try {
    await dbConnect();

    // Get booking enabled status
    const setting = await Settings.findOne({
      key: SETTING_KEYS.BOOKING_ENABLED,
    }).lean();
    const bookingEnabled = setting
      ? Boolean((setting as unknown as { value: boolean }).value)
      : DEFAULT_SETTINGS.bookingEnabled;

    return NextResponse.json({ bookingEnabled });
  } catch (error) {
    console.error("Get booking status error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi kiểm tra trạng thái đặt vé" },
      { status: 500 },
    );
  }
}
