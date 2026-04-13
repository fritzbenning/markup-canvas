import { describe, expect, it } from "vitest";
import { createMatrix } from "./createMatrix";
import { createMatrixString } from "./createMatrixString";

describe("createMatrixString", () => {
  it("formats a DOMMatrix as a CSS matrix() string", () => {
    const m = createMatrix(2, 10, 20);
    expect(createMatrixString(m)).toBe("matrix(2, 0, 0, 2, 10, 20)");
  });
});
