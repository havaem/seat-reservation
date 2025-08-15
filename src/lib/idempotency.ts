import { Schema, model, models } from "mongoose";
import { dbConnect } from "./db";

const IdemSchema = new Schema(
  {
    key: { type: String, unique: true, index: true },
    method: String,
    path: String,
    response: Schema.Types.Mixed,
  },
  { timestamps: true },
);
IdemSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 }); // 24h TTL
export const Idempotency =
  models.Idempotency || model("Idempotency", IdemSchema);

export async function withIdempotency(
  req: Request,
  handler: () => Promise<Response>,
) {
  const key = (req.headers.get("Idempotency-Key") || "").trim();
  if (!key) return handler(); // optional on reads
  await dbConnect();
  const existing = await Idempotency.findOne({ key });
  if (existing)
    return new Response(JSON.stringify(existing.response), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  const res = await handler();
  try {
    const json = await res.clone().json();
    await Idempotency.create({
      key,
      method: req.method,
      path: new URL(req.url).pathname,
      response: json,
    });
  } catch {}
  return res;
}
