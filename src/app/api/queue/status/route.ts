import { NextRequest, NextResponse } from "next/server";

// Simple in-memory queue
const queue = new Map<string, { position: number; timestamp: number }>();
let currentServing = 0;
const MAX_CONCURRENT = 2; // Limit concurrent users

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  // Check if user is already being served
  const activeUsers = Array.from(queue.values()).filter(
    (user) => user.position <= currentServing + MAX_CONCURRENT,
  ).length;

  if (activeUsers < MAX_CONCURRENT) {
    // User can access immediately
    queue.delete(ip);
    return NextResponse.json({
      canAccess: true,
      position: 0,
      estimatedWaitTime: 0,
    });
  }

  // Add to queue if not already there
  if (!queue.has(ip)) {
    const position = queue.size + 1;
    queue.set(ip, { position, timestamp: Date.now() });
  }

  const userQueue = queue.get(ip)!;
  const position = userQueue.position - currentServing;
  const estimatedWaitTime = Math.max(0, position * 30); // 30 seconds per person

  return NextResponse.json(
    {
      canAccess: false,
      position: Math.max(1, position),
      estimatedWaitTime,
      queueLength: queue.size,
    },
    { status: 429 },
  );
}

// Endpoint để advance queue (call định kỳ)
export async function POST() {
  currentServing += 1;

  // Cleanup old queue entries (older than 10 minutes)
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [ip, data] of queue.entries()) {
    if (data.timestamp < tenMinutesAgo) {
      queue.delete(ip);
    }
  }

  return NextResponse.json({ currentServing, queueSize: queue.size });
}
