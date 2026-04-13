import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withDebounce } from "./withDebounce";

describe("withDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs the operation only after delay and resets on repeated calls with the same key", () => {
    const op = vi.fn();
    withDebounce("k1", 100, op);
    expect(op).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    withDebounce("k1", 100, op);
    vi.advanceTimersByTime(99);
    expect(op).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("uses separate timers per key", () => {
    const a = vi.fn();
    const b = vi.fn();
    withDebounce("a", 100, a);
    withDebounce("b", 100, b);
    vi.advanceTimersByTime(100);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
