import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  console.log("test log", request.body);
  return new Response("Hello World");
}
