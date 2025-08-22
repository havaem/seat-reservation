import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Settings } from "@/models/Settings";
import {
  SETTING_KEYS,
  DEFAULT_SETTINGS,
  getPublicSettings,
} from "@/config/settings";

export async function GET() {
  try {
    await dbConnect();

    const publicSettingKeys = getPublicSettings();

    // Get all public settings
    const settingsData = await Settings.find({
      key: { $in: publicSettingKeys },
    }).lean();

    // Build response object with defaults
    const result: Record<string, unknown> = {};

    for (const key of publicSettingKeys) {
      const setting = settingsData.find((s) => s.key === key);
      if (setting) {
        result[key] = (setting as unknown as { value: unknown }).value;
      } else {
        result[key] = DEFAULT_SETTINGS[key];
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get public settings error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy cài đặt" },
      { status: 500 },
    );
  }
}
