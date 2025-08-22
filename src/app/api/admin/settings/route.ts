import { DEFAULT_SETTINGS, SETTING_KEYS, SettingKey } from "@/config/settings";
import { requireAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();

    // Get all settings
    const settings = await Settings.find({}).lean();

    // Convert to key-value object
    const settingsObj = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    // Merge with default settings
    const allSettings = { ...DEFAULT_SETTINGS, ...settingsObj };

    return NextResponse.json({ settings: allSettings });
  } catch (error: unknown) {
    console.error("Get settings error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      errorMessage === "Authentication required" ||
      errorMessage === "Admin access required"
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy cài đặt" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key và value là bắt buộc" },
        { status: 400 },
      );
    }

    // Validate setting key
    if (!Object.values(SETTING_KEYS).includes(key as SettingKey)) {
      return NextResponse.json(
        { error: "Setting key không hợp lệ" },
        { status: 400 },
      );
    }

    // Update or create setting
    await Settings.findOneAndUpdate(
      { key },
      {
        key,
        value,
        updatedAt: new Date(),
        updatedBy: session.user.username,
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      message: "Cập nhật cài đặt thành công",
      setting: { key, value },
    });
  } catch (error: unknown) {
    console.error("Update settings error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      errorMessage === "Authentication required" ||
      errorMessage === "Admin access required"
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật cài đặt" },
      { status: 500 },
    );
  }
}
