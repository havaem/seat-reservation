import { NextResponse } from "next/server";
import { authenticate, createJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username và password là bắt buộc" },
        { status: 400 },
      );
    }

    const user = await authenticate(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Thông tin đăng nhập không chính xác" },
        { status: 401 },
      );
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const sessionData = {
      user,
      expires: expires.toISOString(),
    };

    const token = await createJWT(sessionData);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng nhập" },
      { status: 500 },
    );
  }
}
