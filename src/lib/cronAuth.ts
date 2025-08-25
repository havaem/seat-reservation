import { NextRequest, NextResponse } from "next/server";

/**
 * Validates cron job authorization using CRON_SECRET
 * @param request - The NextRequest object
 * @returns boolean - true if authorized, false otherwise
 */
export function validateCronAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET environment variable is not set");
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${cronSecret}`;

  return authHeader === expectedAuth;
}

/**
 * Returns unauthorized response for cron jobs
 */
export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message: "Invalid or missing cron authorization",
    },
    { status: 401 },
  );
}
