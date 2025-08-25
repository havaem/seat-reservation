// Simple in-memory cache for high-traffic endpoints
const cache = new Map<string, { data: unknown; expiry: number }>();

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs = 30000): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  });

  // Cleanup old entries
  if (cache.size > 100) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now > v.expiry) {
        cache.delete(k);
      }
    }
  }
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}
