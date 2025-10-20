import { centerContent, panDown, panLeft, panRight, panUp, scrollToPoint } from "@/lib/actions/pan/index.js";
import { resetTransform, updateTransform } from "@/lib/actions/transform/index.js";
import { hideGrid, isGridVisible, showGrid, toggleGrid } from "@/lib/actions/ui/grid/index.js";
import { updateThemeMode } from "@/lib/actions/ui/index.js";
import { areRulersVisible, hideRulers, showRulers, toggleRulers } from "@/lib/actions/ui/rulers/index.js";
import { resetView, resetViewToCenter, setZoom, zoomIn, zoomOut, zoomToPoint } from "@/lib/actions/zoom/index.js";
import { fitToScreen } from "@/lib/canvas/fitToScreen.js";
import { getCanvasBounds } from "@/lib/canvas/getCanvasBounds.js";
import { createCanvas } from "@/lib/canvas/index.js";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig.js";
import { EventEmitter } from "@/lib/events/EventEmitter.js";
import { emitTransformEvents } from "@/lib/events/emitTransformEvents.js";
import { setupKeyboardEvents, setupMouseEvents, setupPostMessageEvents, setupTouchEvents, setupWheelEvents } from "@/lib/events/index.js";
import { getVisibleArea, isPointVisible, withFeatureEnabled } from "@/lib/helpers/index.js";
import { canvasToContent } from "@/lib/matrix/canvasToContent.js";
import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { createRulers } from "@/lib/rulers/index.js";
import { broadcastEvent } from "@/lib/window/broadcastEvent.js";
import { cleanupGlobalBinding } from "@/lib/window/cleanupGlobalBinding.js";
import { setupGlobalBinding } from "@/lib/window/setupGlobalBinding.js";
import type {
  BaseCanvas,
  Canvas,
  CanvasBounds,
  MarkupCanvasConfig,
  MarkupCanvasEvents,
  MouseDragControls,
  Transform,
} from "@/types/index.js";

declare global {
  interface Window {
    __markupCanvasTransitionTimeout?: number;
  }
}

export class MarkupCanvas implements Canvas {
  private baseCanvas: BaseCanvas;
  private cleanupFunctions: (() => void)[] = [];
  private rulers: ReturnType<typeof createRulers> | null = null;
  private dragSetup: MouseDragControls | null = null;
  public config: Required<MarkupCanvasConfig>;
  private _isReady = false;
  private listen = new EventEmitter<MarkupCanvasEvents>();
  private postMessageCleanup: (() => void) | null = null;

  constructor(container: HTMLElement, options: MarkupCanvasConfig = {}) {
    if (!container) {
      throw new Error("Container element is required");
    }

    this.config = createMarkupCanvasConfig(options);

    const canvas = createCanvas(container, this.config);
    if (!canvas) {
      throw new Error("Failed to create canvas");
    }

    this.baseCanvas = canvas;

    if (this.config.bindToWindow) {
      this.listen.setEmitInterceptor((event, data) => {
        broadcastEvent(event as string, data, this.config);
      });
      setupGlobalBinding(this, this.config);

      // Set up postMessage listener
      if (this.config.enablePostMessageAPI) {
        this.postMessageCleanup = setupPostMessageEvents(this);
      }
    }

    this.setupEventHandlers();
    this._isReady = true;

    // Emit ready event
    this.listen.emit("ready", this);
  }

  private setupEventHandlers(): void {
    try {
      // Wheel events
      withFeatureEnabled(this.config, "enableZoom", () => {
        const wheelCleanup = setupWheelEvents(this, this.config);
        this.cleanupFunctions.push(wheelCleanup);
      });

      // Mouse events
      if (this.config.enablePan || this.config.enableClickToZoom) {
        this.dragSetup = setupMouseEvents(this, this.config, true);
        this.cleanupFunctions.push(this.dragSetup.cleanup);
      }

      // Keyboard events
      withFeatureEnabled(this.config, "enableKeyboard", () => {
        const keyboardCleanup = setupKeyboardEvents(this, this.config);
        this.cleanupFunctions.push(keyboardCleanup);
      });

      // Touch events
      withFeatureEnabled(this.config, "enableTouch", () => {
        const touchCleanup = setupTouchEvents(this);
        this.cleanupFunctions.push(touchCleanup);
      });

      // Set up rulers and grid
      withFeatureEnabled(this.config, "enableRulers", () => {
        this.rulers = createRulers(this, this.config);
        this.cleanupFunctions.push(() => {
          if (this.rulers) {
            this.rulers.destroy();
          }
        });
      });
    } catch (error) {
      console.error("Failed to set up event handlers:", error);
      this.cleanup();
      throw error;
    }
  }

  // Base canvas properties and methods
  get container(): HTMLElement {
    return this.baseCanvas.container;
  }

  get transformLayer(): HTMLElement {
    return this.baseCanvas.transformLayer;
  }

  get contentLayer(): HTMLElement {
    return this.baseCanvas.contentLayer;
  }

  get transform(): Transform {
    return this.baseCanvas.transform;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get isTransforming(): boolean {
    return this.dragSetup?.isEnabled() || false;
  }

  get visibleBounds(): { x: number; y: number; width: number; height: number } {
    return getVisibleArea(this);
  }

  getBounds(): CanvasBounds {
    return getCanvasBounds(this.baseCanvas, this.config);
  }

  updateTransform(newTransform: Partial<Transform>): boolean {
    const result = updateTransform(this.baseCanvas, newTransform);
    if (result) {
      emitTransformEvents(this.listen, this.baseCanvas);
    }
    return result;
  }

  reset(): boolean {
    const result = resetTransform(this.baseCanvas);
    if (result) {
      emitTransformEvents(this.listen, this.baseCanvas);
    }
    return result;
  }

  setZoom(zoomLevel: number): boolean {
    return setZoom(this, this.transformLayer, this.config, this.zoomToPoint.bind(this), zoomLevel);
  }

  canvasToContent(x: number, y: number): { x: number; y: number } {
    const matrix = createMatrix(
      this.baseCanvas.transform.scale,
      this.baseCanvas.transform.translateX,
      this.baseCanvas.transform.translateY
    );
    return canvasToContent(x, y, matrix);
  }

  zoomToPoint(x: number, y: number, targetScale: number): boolean {
    return zoomToPoint(this.baseCanvas, this.transformLayer, this.config, x, y, targetScale);
  }

  resetView(): boolean {
    return resetView(this.baseCanvas, this.transformLayer, this.config);
  }

  resetViewToCenter(): boolean {
    return resetViewToCenter(this, this.transformLayer, this.config, this.zoomToPoint.bind(this));
  }

  panLeft(distance?: number): boolean {
    return (
      panLeft(this.baseCanvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panLeft(this.baseCanvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  panRight(distance?: number): boolean {
    return (
      panRight(this.baseCanvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panRight(this.baseCanvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  panUp(distance?: number): boolean {
    return (
      panUp(this.baseCanvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panUp(this.baseCanvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  panDown(distance?: number): boolean {
    return (
      panDown(this.baseCanvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panDown(this.baseCanvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  zoomIn(factor: number = 0.5): boolean {
    return zoomIn(this, this.baseCanvas, this.transformLayer, this.config, this.zoomToPoint.bind(this), factor);
  }

  zoomOut(factor: number = 0.5): boolean {
    return zoomOut(this, this.baseCanvas, this.transformLayer, this.config, this.zoomToPoint.bind(this), factor);
  }

  resetZoom(): boolean {
    return this.resetViewToCenter();
  }

  // Mouse drag control methods
  enableMouseDrag(): boolean {
    return this.dragSetup?.enable() ?? false;
  }

  disableMouseDrag(): boolean {
    return this.dragSetup?.disable() ?? false;
  }

  isMouseDragEnabled(): boolean {
    return this.dragSetup?.isEnabled() ?? false;
  }

  toggleGrid(): boolean {
    return toggleGrid(this.rulers);
  }

  showGrid(): boolean {
    return showGrid(this.rulers);
  }

  hideGrid(): boolean {
    return hideGrid(this.rulers);
  }

  isGridVisible(): boolean {
    return isGridVisible(this.rulers);
  }

  toggleRulers(): boolean {
    return toggleRulers(this.rulers, () => this.areRulersVisible());
  }

  showRulers(): boolean {
    return showRulers(this.rulers);
  }

  hideRulers(): boolean {
    return hideRulers(this.rulers);
  }

  areRulersVisible(): boolean {
    return areRulersVisible(this.rulers);
  }

  centerContent(): boolean {
    return centerContent(this.baseCanvas, this.config, this.updateTransform.bind(this), this.transformLayer);
  }

  fitToScreen(): boolean {
    return fitToScreen(this.baseCanvas, this.transformLayer, this.config);
  }

  getVisibleArea(): { x: number; y: number; width: number; height: number } {
    return getVisibleArea(this);
  }

  isPointVisible(x: number, y: number): boolean {
    return isPointVisible(this, x, y);
  }

  scrollToPoint(x: number, y: number): boolean {
    return scrollToPoint(this.baseCanvas, this.config, x, y, this.updateTransform.bind(this), this.transformLayer);
  }

  // Configuration access
  getConfig(): Required<MarkupCanvasConfig> {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<MarkupCanvasConfig>): void {
    this.config = createMarkupCanvasConfig({ ...this.config, ...newConfig });
  }

  // Theme management
  updateThemeMode(mode: "light" | "dark"): void {
    this.config = createMarkupCanvasConfig({ ...this.config, themeMode: mode });
    updateThemeMode(this.baseCanvas.container, this.config, this.rulers, mode);
  }

  // Cleanup method
  cleanup(): void {
    cleanupGlobalBinding(this.config);

    // Cleanup postMessage listener
    if (this.postMessageCleanup) {
      this.postMessageCleanup();
      this.postMessageCleanup = null;
    }

    this.cleanupFunctions.forEach((cleanup) => {
      try {
        cleanup();
      } catch (cleanupError) {
        console.warn("Error during cleanup:", cleanupError);
      }
    });
    this.cleanupFunctions = [];

    // Remove all event listeners
    this.removeAllListeners();
  }

  // Event emitter delegation methods
  on<K extends keyof MarkupCanvasEvents>(event: K, handler: (data: MarkupCanvasEvents[K]) => void): void {
    this.listen.on(event, handler);
  }

  off<K extends keyof MarkupCanvasEvents>(event: K, handler: (data: MarkupCanvasEvents[K]) => void): void {
    this.listen.off(event, handler);
  }

  emit<K extends keyof MarkupCanvasEvents>(event: K, data: MarkupCanvasEvents[K]): void {
    this.listen.emit(event, data);
  }

  removeAllListeners(): void {
    this.listen.removeAllListeners();
  }

  destroy(): void {
    this.cleanup();

    if (window.__markupCanvasTransitionTimeout) {
      clearTimeout(window.__markupCanvasTransitionTimeout);
    }
  }
}
