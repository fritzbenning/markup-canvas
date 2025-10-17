import type { Transform } from "./canvas";

export interface MarkupCanvasConfig {
  // Canvas dimensions
  width?: number;
  height?: number;
  enableAcceleration?: boolean;

  // Interaction controls
  enableZoom?: boolean;
  enablePan?: boolean;
  enableTouch?: boolean;
  enableKeyboard?: boolean;
  limitKeyboardEventsToCanvas?: boolean;

  // Zoom behavior
  zoomSpeed?: number;
  minZoom?: number;
  maxZoom?: number;
  enableTransition?: boolean;
  transitionDuration?: number;
  enableAdaptiveSpeed?: boolean;

  // Pan behavior
  enableLeftDrag?: boolean;
  enableMiddleDrag?: boolean;
  requireSpaceForMouseDrag?: boolean;
  keyboardPanStep?: number;
  keyboardFastMultiplier?: number;
  keyboardZoomStep?: number;

  // Click-to-zoom
  enableClickToZoom?: boolean;
  clickZoomLevel?: number;
  requireOptionForClickZoom?: boolean;

  // Visual elements
  enableRulers?: boolean;
  enableGrid?: boolean;
  gridColor?: string;

  // Ruler styling
  rulerBackgroundColor?: string;
  rulerBorderColor?: string;
  rulerTextColor?: string;
  rulerMajorTickColor?: string;
  rulerMinorTickColor?: string;
  rulerFontSize?: number;
  rulerFontFamily?: string;
  rulerUnits?: string;
  rulerSize?: number;

  // Callbacks
  onTransformUpdate?: (transform: Transform) => void;
}
