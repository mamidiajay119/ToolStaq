// Lightweight sliding-window IP rate limiter for Next.js API routes & Server Actions

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitTracker>();

// Clean up expired IP entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, tracker] of rateLimitStore.entries()) {
    if (now > tracker.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const tracker = rateLimitStore.get(identifier);

  if (!tracker || now > tracker.resetTime) {
    const newTracker: RateLimitTracker = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newTracker);
    return {
      success: true,
      remaining: limit - 1,
      reset: newTracker.resetTime,
    };
  }

  if (tracker.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: tracker.resetTime,
    };
  }

  tracker.count += 1;
  rateLimitStore.set(identifier, tracker);

  return {
    success: true,
    remaining: limit - tracker.count,
    reset: tracker.resetTime,
  };
}
