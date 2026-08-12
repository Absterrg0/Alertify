type Window = { count: number; resetsAt: number };
const eventWindows = new Map<string, Window>();

export function consumeEventLimit(
  key: string,
  cost: number,
  limit = 120,
  windowMs = 60_000,
) {
  const now = Date.now();
  const current = eventWindows.get(key);
  if (!current || current.resetsAt <= now) {
    if (eventWindows.size >= 10_000) {
      for (const [candidate, window] of eventWindows) {
        if (window.resetsAt <= now) eventWindows.delete(candidate);
      }
      const oldest = eventWindows.keys().next().value;
      if (eventWindows.size >= 10_000 && oldest) eventWindows.delete(oldest);
    }
    eventWindows.set(key, { count: cost, resetsAt: now + windowMs });
    return cost <= limit;
  }
  if (current.count + cost > limit) return false;
  current.count += cost;
  return true;
}
