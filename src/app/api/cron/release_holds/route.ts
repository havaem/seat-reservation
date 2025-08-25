// /app/api/_cron/release_holds/route.ts
import { dbConnect } from "@/lib/db";
import { Hold } from "@/models/Hold";
import { Seat } from "@/models/Seat";
import { Order } from "@/models/Order";
import { NextRequest } from "next/server";
import { validateCronAuth, createUnauthorizedResponse } from "@/lib/cronAuth";

export async function GET(request: NextRequest) {
  // Validate cron authorization
  if (!validateCronAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    await dbConnect();
    const now = new Date();

    // Lấy các hold đã hết hạn (xử lý batch để tránh quá tải)
    const holds = await Hold.find({ expiresAt: { $lte: now } })
      .sort({ expiresAt: 1 })
      .limit(500)
      .lean();

    let releasedSeats = 0;
    let skipped = 0;

    for (const h of holds) {
      // Nếu có order đang pending/paid đụng các seat này -> bỏ qua, để cron đơn xử lý
      const activeOrder = await Order.exists({
        seatIds: { $in: h.seatIds },
        status: { $in: ["pending_offline", "paid_offline"] },
      });
      if (activeOrder) {
        skipped++;
        // vẫn xoá Hold document này để tránh đụng TTL, nhưng KHÔNG đụng tới ghế
        await Hold.deleteOne({ _id: h._id });
        continue;
      }

      // Release ghế đang bị hold bởi holdId này
      const upd = await Seat.updateMany(
        { seatId: { $in: h.seatIds }, status: "held", holdId: String(h._id) },
        { $set: { status: "available", holdId: null } },
      );

      releasedSeats += upd.modifiedCount;

      // Xoá Hold luôn (dù TTL cũng sẽ xoá, làm ngay cho chắc)
      await Hold.deleteOne({ _id: h._id });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        checkedHolds: holds.length,
        releasedSeats,
        skippedWithActiveOrder: skipped,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "content-type": "application/json" } },
    );
  } catch (error) {
    console.error("Release holds error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to release holds",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
