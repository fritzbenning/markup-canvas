import { vi } from "vitest";

/**
 * Stubbed canvas methods used by keyboard tests (implemented with `vi.fn`, typed by call shape only).
 */
export type CanvasMethodStubs = {
  panLeft: () => boolean;
  panRight: () => boolean;
  panUp: () => boolean;
  panDown: () => boolean;
  zoomIn: () => boolean;
  zoomOut: () => boolean;
  reset: () => void;
  resetZoom: () => void;
  toggleGrid: () => boolean;
  toggleRulers: () => boolean;
};

/**
 * Shared `vi.fn` stubs for canvas methods referenced by keyboard shortcut rules.
 */
export function createCanvasMethodStubs(): CanvasMethodStubs {
  return {
    panLeft: vi.fn(() => true),
    panRight: vi.fn(() => true),
    panUp: vi.fn(() => true),
    panDown: vi.fn(() => true),
    zoomIn: vi.fn(() => true),
    zoomOut: vi.fn(() => true),
    reset: vi.fn(),
    resetZoom: vi.fn(),
    toggleGrid: vi.fn(() => true),
    toggleRulers: vi.fn(() => true),
  } as CanvasMethodStubs;
}
