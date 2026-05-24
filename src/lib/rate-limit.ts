// Simple in-memory rate limiter with IP-based windowing
// For production, use Redis or Upstash

const ipMap = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10; // 10 audits per hour per IP

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
