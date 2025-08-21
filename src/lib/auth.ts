import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-for-development",
);

export interface User {
  id: string;
  username: string;
  role: "admin" | "user";
}

export interface SessionData {
  user: User;
  expires: string;
}

// Hardcoded admin credentials (in production, use database)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // In production, use hashed passwords
  role: "admin" as const,
};

export async function createJWT(payload: SessionData): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<SessionData> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as SessionData;
}

export async function authenticate(
  username: string,
  password: string,
): Promise<User | null> {
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    return {
      id: "1",
      username: ADMIN_CREDENTIALS.username,
      role: ADMIN_CREDENTIALS.role,
    };
  }
  return null;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = await verifyJWT(sessionCookie.value);
    return session;
  } catch (error) {
    console.error("Invalid session:", error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await requireAuth();
  if (session.user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return session;
}
