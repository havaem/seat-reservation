// Rate limiting cho peak traffic
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  ip: string,
  maxRequests = 20,
  windowMs = 60000,
): boolean {
  const now = Date.now();
  const key = ip;

  const current = rateLimit.get(key);

  if (!current || now > current.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

export function getRateLimitResponse() {
  return new Response(
    JSON.stringify({
      error: "Quá nhiều yêu cầu, vui lòng thử lại sau",
      code: "RATE_LIMITED",
    }),
    {
      status: 429,
      headers: { "Content-Type": "application/json" },
    },
  );
}

// Advanced rate limiting with queue integration
export async function checkQueueAndRateLimit(
  request: Request,
  maxRequests = 5,
  windowMs = 60000,
) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // First check rate limit
  if (!checkRateLimit(ip, maxRequests, windowMs)) {
    return {
      allowed: false,
      response: getRateLimitResponse(),
    };
  }

  // Then check queue status
  try {
    const queueResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/queue/status`,
      {
        headers: {
          "x-forwarded-for": ip,
        },
      },
    );

    if (queueResponse.status === 429) {
      const queueData = await queueResponse.json();
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({
            error: "Vui lòng chờ trong hàng đợi",
            code: "QUEUED",
            queueData,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        ),
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Queue check failed:", error);
    // If queue check fails, fall back to rate limiting only
    return { allowed: true };
  }
}
