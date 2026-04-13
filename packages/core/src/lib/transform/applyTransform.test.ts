import { describe, expect, it } from "vitest";
import { createMatrix } from "@/lib/matrix/createMatrix";
import { createMatrixString } from "@/lib/matrix/createMatrixString";
import { applyTransform } from "./applyTransform";

describe("applyTransform", () => {
  it("sets element style transform from matrix and returns true", () => {
    const el = document.createElement("div");
    const matrix = createMatrix(2, 10, 20);

    const ok = applyTransform(el, matrix);

    expect(ok).toBe(true);
    expect(el.style.transform).toBe(createMatrixString(matrix));
  });

  it("returns false when element is missing", () => {
    const matrix = createMatrix(1, 0, 0);
    const ok = applyTransform(null as unknown as HTMLElement, matrix);
    expect(ok).toBe(false);
  });
});
