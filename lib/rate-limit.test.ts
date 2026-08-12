import { describe, expect, it, vi } from "vitest";

import { consumeEventLimit } from "./event-rate-limit";

describe("event rate limit", () => {
  it("counts batched events and resets after the window", () => {
    vi.useFakeTimers();
    expect(consumeEventLimit("site:visitor", 3, 5, 1_000)).toBe(true);
    expect(consumeEventLimit("site:visitor", 3, 5, 1_000)).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect(consumeEventLimit("site:visitor", 3, 5, 1_000)).toBe(true);
    vi.useRealTimers();
  });
});
