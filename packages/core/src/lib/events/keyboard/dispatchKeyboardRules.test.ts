import { describe, expect, it } from "vitest";
import { dispatchKeyboardRules } from "./dispatchKeyboardRules";
import { createKeyboardTestCanvas } from "./test/createKeyboardTestCanvas";
import { createTestKeyboardContext } from "./test/createTestKeyboardContext";

describe("dispatchKeyboardRules", () => {
  it("handles ArrowLeft with panLeft in default scope", () => {
    const canvas = createKeyboardTestCanvas();
    const ctx = createTestKeyboardContext({ canvas });
    const handled = dispatchKeyboardRules(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }), ctx);
    expect(handled).toBe(true);
    expect(canvas.panLeft).toHaveBeenCalledOnce();
  });

  it("does not run default-scoped pan rules in restricted scope", () => {
    const canvas = createKeyboardTestCanvas();
    const ctx = createTestKeyboardContext({ canvas, keyboardScope: "restricted" });
    const handled = dispatchKeyboardRules(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }), ctx);
    expect(handled).toBe(false);
    expect(canvas.panLeft).not.toHaveBeenCalled();
  });

  it("still handles Ctrl+0 reset in restricted scope", () => {
    const canvas = createKeyboardTestCanvas();
    const ctx = createTestKeyboardContext({ canvas, keyboardScope: "restricted" });
    const handled = dispatchKeyboardRules(
      new KeyboardEvent("keydown", { key: "0", ctrlKey: true, bubbles: true }),
      ctx,
    );
    expect(handled).toBe(true);
    expect(canvas.reset).toHaveBeenCalled();
  });

  it("zooms in on '=' with default scope", () => {
    const canvas = createKeyboardTestCanvas();
    const ctx = createTestKeyboardContext({ canvas });
    const handled = dispatchKeyboardRules(new KeyboardEvent("keydown", { key: "=", bubbles: true }), ctx);
    expect(handled).toBe(true);
    expect(canvas.zoomIn).toHaveBeenCalled();
  });
});
