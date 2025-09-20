import type {
  KeyboardNavigationOptions,
  MouseDragOptions,
  TouchEventsOptions,
  WheelZoomOptions,
} from "../../types/index.js";

export const DEFAULT_WHEEL_ZOOM_CONFIG: Required<WheelZoomOptions> = {
  zoomSpeed: 2,
  fineZoomSpeed: 0.4,
  smoothTransition: true,
  enableAdaptiveSpeed: true,
};

export const DEFAULT_MOUSE_DRAG_CONFIG: Required<MouseDragOptions> = {
  enableLeftDrag: true,
  enableMiddleDrag: true,
  requireSpaceForMouseDrag: false,
  enableClickToZoom: true,
  clickZoomLevel: 1.0,
  clickZoomDuration: 300,
  requireOptionForClickZoom: false,
};

export const DEFAULT_KEYBOARD_CONFIG: Required<KeyboardNavigationOptions> = {
  panStep: 50,
  fastPanMultiplier: 3,
  zoomStep: 0.1,
  enableAdaptiveSpeed: true,
};

export const DEFAULT_TOUCH_CONFIG: Required<TouchEventsOptions> = {
  enableSingleTouchPan: true,
  enableMultiTouch: true,
};

export const REFERENCE_DISPLAY_AREA = 1920 * 1080;

export const ADAPTIVE_ZOOM_FACTOR = 1.2;

export const CLICK_THRESHOLDS = {
  MAX_DURATION: 300,
  MAX_MOVEMENT: 5,
} as const;

export const GESTURE_DETECTION_WEIGHTS = {
  SMALL_DELTA: 2,
  PIXEL_MODE: 2,
  FRACTIONAL_DELTA: 1,
  BOTH_AXES: 1,
  LARGE_DELTA: 2,
  LINE_MODE: 2,
  SINGLE_AXIS: 1,
  MAX_SCORE: 6,
} as const;

export const TRACKPAD_THRESHOLDS = {
  SMALL_DELTA: 50,
  LARGE_DELTA: 100,
  CONFIDENCE_THRESHOLD: 0.7,
  PINCH_SPEED_MULTIPLIER: 0.22, // Increased from 0.15 for more responsive zoom
  LOW_CONFIDENCE_MULTIPLIER: 0.75, // Increased from 0.6 for less conservative zoom
} as const;
