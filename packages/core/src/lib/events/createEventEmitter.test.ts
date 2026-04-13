import { describe, expect, it, vi } from "vitest";
import { createEventEmitter } from "./createEventEmitter";

interface TestEvents extends Record<string, unknown> {
  ping: number;
  msg: string;
}

describe("createEventEmitter", () => {
  it("calls handlers registered with on when emit runs", () => {
    const emitter = createEventEmitter<TestEvents>();
    const handler = vi.fn();
    emitter.on("ping", handler);
    emitter.emit("ping", 42);
    expect(handler).toHaveBeenCalledWith(42);
  });

  it("invokes multiple handlers for the same event in registration order", () => {
    const emitter = createEventEmitter<TestEvents>();
    const order: number[] = [];
    emitter.on("ping", () => order.push(1));
    emitter.on("ping", () => order.push(2));
    emitter.emit("ping", 0);
    expect(order).toEqual([1, 2]);
  });

  it("does not invoke handlers after off with the same reference", () => {
    const emitter = createEventEmitter<TestEvents>();
    const handler = vi.fn();
    emitter.on("msg", handler);
    emitter.off("msg", handler);
    emitter.emit("msg", "x");
    expect(handler).not.toHaveBeenCalled();
  });

  it("runs emitInterceptor before listeners", () => {
    const emitter = createEventEmitter<TestEvents>();
    const order: string[] = [];
    emitter.setEmitInterceptor(() => order.push("i"));
    emitter.on("ping", () => order.push("h"));
    emitter.emit("ping", 1);
    expect(order).toEqual(["i", "h"]);
  });

  it("logs and continues when a handler throws", () => {
    const emitter = createEventEmitter<TestEvents>();
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    emitter.on("ping", () => {
      throw new Error("fail");
    });
    const second = vi.fn();
    emitter.on("ping", second);
    emitter.emit("ping", 1);
    expect(second).toHaveBeenCalled();
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it("removeAllListeners clears subscribers", () => {
    const emitter = createEventEmitter<TestEvents>();
    const handler = vi.fn();
    emitter.on("ping", handler);
    emitter.removeAllListeners();
    emitter.emit("ping", 1);
    expect(handler).not.toHaveBeenCalled();
  });

  it("emit with no listeners does not throw", () => {
    const emitter = createEventEmitter<TestEvents>();
    expect(() => emitter.emit("ping", 0)).not.toThrow();
  });
});
