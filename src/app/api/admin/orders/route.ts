import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Seat } from "@/models/Seat";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build filter
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { "buyer.fullName": { $regex: search, $options: "i" } },
        { "buyer.email": { $regex: search, $options: "i" } },
        { "buyer.phone": { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: unknown) {
    console.error("Get orders error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      errorMessage === "Authentication required" ||
      errorMessage === "Admin access required"
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách đơn hàng" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    await dbConnect();

    const body = await request.json();
    const { orderId, action, reviewNote } = body;

    if (!orderId || !action) {
      return NextResponse.json(
        { error: "orderId và action là bắt buộc" },
        { status: 400 },
      );
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 },
      );
    }

    if (action === "approve") {
      order.status = "paid_offline";
      order.paidAt = new Date();
      order.reviewNote = reviewNote;
      order.reviewedAt = new Date();

      // Update seats to reserved
      await Seat.updateMany(
        { seatId: { $in: order.seatIds } },
        { $set: { status: "reserved" } },
      );
    } else if (action === "reject") {
      order.status = "cancelled";
      order.reviewNote = reviewNote;
      order.reviewedAt = new Date();

      // Release seats
      await Seat.updateMany(
        { seatId: { $in: order.seatIds } },
        { $set: { status: "available" } },
      );
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message:
        action === "approve" ? "Đã duyệt đơn hàng" : "Đã từ chối đơn hàng",
      order,
    });
  } catch (error: unknown) {
    console.error("Update order error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      errorMessage === "Authentication required" ||
      errorMessage === "Admin access required"
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật đơn hàng" },
      { status: 500 },
    );
  }
}
