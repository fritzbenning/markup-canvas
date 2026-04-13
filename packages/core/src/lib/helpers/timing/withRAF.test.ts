import { describe, expect, it, vi } from "vitest";
import { withRAF, withRAFThrottle } from "./withRAF";

async function flushAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe("withRAF", () => {
  it("runs the operation on the next animation frame", async () => {
    const op = vi.fn();
    withRAF(op);
    expect(op).not.toHaveBeenCalled();
    await flushAnimationFrame();
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("returns a cancel function that skips the operation", async () => {
    const op = vi.fn();
    const cancel = withRAF(op);
    cancel();
    await flushAnimationFrame();
    expect(op).not.toHaveBeenCalled();
  });
});

describe("withRAFThrottle", () => {
  it("invokes the function once per frame with the latest arguments", async () => {
    const fn = vi.fn();
    const th = withRAFThrottle(fn);
    th(1);
    th(2);
    th(3);
    expect(fn).not.toHaveBeenCalled();
    await flushAnimationFrame();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it("cleanup cancels a pending frame", async () => {
    const fn = vi.fn();
    const th = withRAFThrottle(fn);
    th(1);
    th.cleanup();
    await flushAnimationFrame();
    expect(fn).not.toHaveBeenCalled();
  });
});
