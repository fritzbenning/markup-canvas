import { describe, expect, it } from "vitest";
import { isCanvasShortcut } from "./isCanvasShortcut";

function ev(init: Partial<KeyboardEventInit & { key: string }>): KeyboardEvent {
  return new KeyboardEvent("keydown", { bubbles: true, ...init });
}

describe("isCanvasShortcut", () => {
  it("returns true for Ctrl/Meta + 0, +, or -", () => {
    expect(isCanvasShortcut(ev({ key: "0", ctrlKey: true }))).toBe(true);
    expect(isCanvasShortcut(ev({ key: "0", metaKey: true }))).toBe(true);
    expect(isCanvasShortcut(ev({ key: "+", ctrlKey: true }))).toBe(true);
    expect(isCanvasShortcut(ev({ key: "-", metaKey: true }))).toBe(true);
  });

  it("returns false for other chords", () => {
    expect(isCanvasShortcut(ev({ key: "a", ctrlKey: true }))).toBe(false);
    expect(isCanvasShortcut(ev({ key: "0" }))).toBe(false);
  });
});
