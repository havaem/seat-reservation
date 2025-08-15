import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const ord = await Order.findById(id);
  if (!ord) return new Response("Not found", { status: 404 });
  return new Response(
    JSON.stringify({
      orderId: ord._id,
      status: ord.status,
      amount: ord.amount,
      expiresAt: ord.expiresAt,
      bankHint: {
        accountName: process.env.BANK_ACC_NAME,
        accountNumber: process.env.BANK_ACC_NUMBER,
        bank: process.env.BANK_NAME,
        content: ord.bankContent,
        amount: ord.amount,
      },
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}
