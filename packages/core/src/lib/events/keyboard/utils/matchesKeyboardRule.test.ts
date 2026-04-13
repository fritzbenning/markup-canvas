import { describe, expect, it } from "vitest";
import type { KeyboardRule } from "../types";
import { matchesKeyboardRule } from "./matchesKeyboardRule";

function ev(init: Partial<KeyboardEventInit & { key: string }>): KeyboardEvent {
  return new KeyboardEvent("keydown", { bubbles: true, ...init });
}

describe("matchesKeyboardRule", () => {
  it("matches a single string key with no modifier requirements", () => {
    const rule: Pick<KeyboardRule, "keys" | "withModifiers" | "withoutModifiers"> = {
      keys: "a",
    };
    expect(matchesKeyboardRule(ev({ key: "a" }), rule)).toBe(true);
    expect(matchesKeyboardRule(ev({ key: "b" }), rule)).toBe(false);
  });

  it("matches when event.key is one of several keys", () => {
    const rule: Pick<KeyboardRule, "keys" | "withModifiers" | "withoutModifiers"> = {
      keys: ["=", "+"],
    };
    expect(matchesKeyboardRule(ev({ key: "=" }), rule)).toBe(true);
    expect(matchesKeyboardRule(ev({ key: "+" }), rule)).toBe(true);
  });

  it("requires all withModifiers to be held", () => {
    const rule: Pick<KeyboardRule, "keys" | "withModifiers" | "withoutModifiers"> = {
      keys: "s",
      withModifiers: ["ctrl", "shift"],
    };
    expect(matchesKeyboardRule(ev({ key: "s", ctrlKey: true, shiftKey: true }), rule)).toBe(true);
    expect(matchesKeyboardRule(ev({ key: "s", ctrlKey: true, shiftKey: false }), rule)).toBe(false);
  });

  it("rejects when a withoutModifiers key is held", () => {
    const rule: Pick<KeyboardRule, "keys" | "withModifiers" | "withoutModifiers"> = {
      keys: "0",
      withModifiers: ["meta"],
      withoutModifiers: ["ctrl"],
    };
    expect(matchesKeyboardRule(ev({ key: "0", metaKey: true, ctrlKey: false }), rule)).toBe(true);
    expect(matchesKeyboardRule(ev({ key: "0", metaKey: true, ctrlKey: true }), rule)).toBe(false);
  });
});
