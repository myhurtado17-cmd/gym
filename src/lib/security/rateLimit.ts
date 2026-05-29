type Bucket = {
  count: number;
  resetAtMs: number;
};

const buckets = new Map<string, Bucket>();

function nowMs() {
  return Date.now();
}

export function rateLimit(params: {
  key: string;
  windowMs: number;
  max: number;
}) {
  const { key, windowMs, max } = params;
  const t = nowMs();
  const existing = buckets.get(key);

  if (!existing || existing.resetAtMs <= t) {
    const b: Bucket = { count: 1, resetAtMs: t + windowMs };
    buckets.set(key, b);
    return {
      allowed: true,
      remaining: max - 1,
      resetAtMs: b.resetAtMs
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, max - existing.count);
  const allowed = existing.count <= max;

  // simple opportunistic cleanup
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.resetAtMs <= t) buckets.delete(k);
    }
  }

  return { allowed, remaining, resetAtMs: existing.resetAtMs };
}

export function getClientIp(request: Request) {
  // Vercel/Proxy common headers
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const rip = request.headers.get('x-real-ip');
  if (rip) return rip.trim();
  return 'unknown';
}
