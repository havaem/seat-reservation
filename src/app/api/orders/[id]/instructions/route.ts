import { Order, OrderDoc } from "@/models/Order";
import { dbConnect } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const ord = await Order.findById(params.id);
  if (!ord) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify({
    orderId: ord._id,
    status: ord.status,
    amount: ord.amount,
    expiresAt: ord.expiresAt,
    bankHint: {
      accountName: process.env.BANK_ACC_NAME,
      accountNumber: process.env.BANK_ACC_NUMBER,
      bank: process.env.BANK_NAME,
      content: ord.bankContent,
      amountSuggestion: ord.amountSuggestion,
    },
  }), { status: 200, headers: { "content-type": "application/json" } });
}