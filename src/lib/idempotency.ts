// /lib/idempotency.ts
import { Schema, model, models } from "mongoose";
import { dbConnect } from "./db";
import crypto from "crypto";

type JsonObject = Record<string, any>;

const IDEMP_HEADER = "Idempotency-Key";
const TTL_SECONDS = 60 * 60 * 24; // 24h
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
type IdemDoc = {
  key: string;
  method: string;
  path: string;
  bodyHash: string;
  response: JsonObject;
};
const IdemSchema = new Schema<IdemDoc>(
  {
    key: { type: String, unique: true, index: true, required: true },
    method: { type: String, index: true, required: true },
    path: { type: String, index: true, required: true },
    bodyHash: { type: String, index: true, required: true },
    response: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);
IdemSchema.index({ createdAt: 1 }, { expireAfterSeconds: TTL_SECONDS });

export const Idempotency =
  models.Idempotency || model("Idempotency", IdemSchema);

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

async function maybePersist({
  key,
  req,
  res,
  path,
  bodyHash,
}: {
  key: string;
  req: Request;
  res: Response;
  path: string;
  bodyHash: string;
}) {
  if (!MUTATING_METHODS.has(req.method)) return;
  if (!res.ok) return;
  let payload: JsonObject | null = null;
  try {
    payload = await res.clone().json();
  } catch {
    return;
  }
  try {
    await Idempotency.create({
      key,
      method: req.method,
      path,
      bodyHash,
      response: payload,
    });
  } catch (err) {
    // Ignore duplicate insert races etc.
  }
}

export async function withIdempotency(
  req: Request,
  handler: () => Promise<Response>,
): Promise<Response> {
  const key = (req.headers.get(IDEMP_HEADER) || "").trim();
  if (!key) return handler();

  const path = new URL(req.url).pathname;
  let bodyText = "";
  if (MUTATING_METHODS.has(req.method)) {
    try {
      bodyText = await req.clone().text();
    } catch {
      bodyText = "";
    }
  }
  const bodyHash = sha256(bodyText);

  await dbConnect();

  const existing = await Idempotency.findOne({ key });
  if (existing) {
    if (
      existing.method !== req.method ||
      existing.path !== path ||
      existing.bodyHash !== bodyHash
    ) {
      return new Response(JSON.stringify({ code: "IDEMP_CONFLICT" }), {
        status: 409,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify(existing.response), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const res = await handler();
  await maybePersist({ key, req, res, path, bodyHash });
  return res;
}
