import { centerContent, panDown, panLeft, panRight, panUp, scrollToPoint } from "@/lib/actions/pan/index.js";
import { resetTransform, updateTransform } from "@/lib/actions/transform/index.js";
import { hideGrid, isGridVisible, showGrid, toggleGrid, toggleTransition, updateThemeMode } from "@/lib/actions/ui/index.js";
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
import { cleanupWindowBinding } from "@/lib/window/cleanupWindowBinding.js";
import { bindCanvasToWindow } from "@/lib/window/index.js";
import type { Canvas, CanvasBounds, MarkupCanvasConfig, MarkupCanvasEvents, MouseDragControls, Transform } from "@/types/index.js";

declare global {
  interface Window {
    __markupCanvasTransitionTimeout?: number;
  }
}

export class MarkupCanvas {
  private canvas: Canvas;
  private cleanupCallbacks: (() => void)[] = [];
  private rulers: ReturnType<typeof createRulers> | null = null;
  private dragSetup: MouseDragControls | null = null;
  public config: Required<MarkupCanvasConfig>;
  public event = new EventEmitter<MarkupCanvasEvents>();
  private _isReady = false;

  constructor(container: HTMLElement, options: MarkupCanvasConfig = {}) {
    if (!container) {
      throw new Error("Container element is required");
    }

    this.config = createMarkupCanvasConfig(options);

    const canvas = createCanvas(container, this.config);
    if (!canvas) {
      throw new Error("Failed to create canvas");
    }

    this.canvas = canvas;

    // Always bind canvas to window
    this.event.setEmitInterceptor((event, data) => {
      broadcastEvent(event as string, data, this.config);
    });

    bindCanvasToWindow(this, this.config);

    // Set up postMessage listener
    if (this.config.enablePostMessageAPI) {
      const postMessageCleanup = setupPostMessageEvents(this);
      this.cleanupCallbacks.push(postMessageCleanup);
    }

    this.setupEventHandlers();
    this._isReady = true;

    // Emit ready event
    this.event.emit("ready", this);
  }

  private setupEventHandlers(): void {
    try {
      // Wheel events
      withFeatureEnabled(this.config, "enableZoom", () => {
        const wheelCleanup = setupWheelEvents(this, this.config);
        this.cleanupCallbacks.push(wheelCleanup);
      });

      // Mouse events
      if (this.config.enablePan || this.config.enableClickToZoom) {
        this.dragSetup = setupMouseEvents(this, this.config, true);
        this.cleanupCallbacks.push(this.dragSetup.cleanup);
      }

      // Keyboard events
      withFeatureEnabled(this.config, "enableKeyboard", () => {
        const keyboardCleanup = setupKeyboardEvents(this, this.config);
        this.cleanupCallbacks.push(keyboardCleanup);
      });

      // Touch events
      withFeatureEnabled(this.config, "enableTouch", () => {
        const touchCleanup = setupTouchEvents(this);
        this.cleanupCallbacks.push(touchCleanup);
      });

      // Set up rulers and grid
      withFeatureEnabled(this.config, "enableRulers", () => {
        this.rulers = createRulers(this, this.config);
        this.cleanupCallbacks.push(() => {
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

  get container(): HTMLElement {
    return this.canvas.container;
  }

  get transformLayer(): HTMLElement {
    return this.canvas.transformLayer;
  }

  get contentLayer(): HTMLElement {
    return this.canvas.contentLayer;
  }

  get transform(): Transform {
    return this.canvas.transform;
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
    return getCanvasBounds(this.canvas, this.config);
  }

  updateTransform(newTransform: Partial<Transform>): boolean {
    const result = updateTransform(this.canvas, newTransform);
    if (result) {
      emitTransformEvents(this.event, this.canvas);
    }
    return result;
  }

  reset(): boolean {
    const result = resetTransform(this.canvas);
    if (result) {
      emitTransformEvents(this.event, this.canvas);
    }
    return result;
  }

  setZoom(zoomLevel: number): boolean {
    return setZoom(this, this.transformLayer, this.config, this.zoomToPoint.bind(this), zoomLevel);
  }

  canvasToContent(x: number, y: number): { x: number; y: number } {
    const matrix = createMatrix(this.canvas.transform.scale, this.canvas.transform.translateX, this.canvas.transform.translateY);
    return canvasToContent(x, y, matrix);
  }

  zoomToPoint(x: number, y: number, targetScale: number): boolean {
    return zoomToPoint(this.canvas, this.transformLayer, this.config, x, y, targetScale);
  }

  resetView(): boolean {
    return resetView(this.canvas, this.transformLayer, this.config);
  }

  resetViewToCenter(): boolean {
    return resetViewToCenter(this, this.transformLayer, this.config, this.zoomToPoint.bind(this));
  }

  panLeft(distance?: number): boolean {
    return (
      panLeft(this.canvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panLeft(this.canvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  panRight(distance?: number): boolean {
    return (
      panRight(this.canvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panRight(this.canvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  panUp(distance?: number): boolean {
    return (
      panUp(this.canvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panUp(this.canvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  panDown(distance?: number): boolean {
    return (
      panDown(this.canvas, this.config, this.updateTransform.bind(this)) ||
      (distance ? panDown(this.canvas, { ...this.config, keyboardPanStep: distance }, this.updateTransform.bind(this)) : false)
    );
  }

  zoomIn(factor: number = 0.5): boolean {
    return zoomIn(this, this.transformLayer, this.config, this.zoomToPoint.bind(this), factor);
  }

  zoomOut(factor: number = 0.5): boolean {
    return zoomOut(this, this.transformLayer, this.config, this.zoomToPoint.bind(this), factor);
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
    const result = toggleGrid(this.rulers);
    if (result) {
      this.event.emit("gridVisibility", this.isGridVisible());
    }
    return result;
  }

  showGrid(): boolean {
    const result = showGrid(this.rulers);
    if (result) {
      this.event.emit("gridVisibility", true);
    }
    return result;
  }

  hideGrid(): boolean {
    const result = hideGrid(this.rulers);
    if (result) {
      this.event.emit("gridVisibility", false);
    }
    return result;
  }

  isGridVisible(): boolean {
    return isGridVisible(this.rulers);
  }

  toggleRulers(): boolean {
    const result = toggleRulers(this.rulers, () => this.areRulersVisible());
    if (result) {
      this.event.emit("rulersVisibility", this.areRulersVisible());
    }
    return result;
  }

  showRulers(): boolean {
    const result = showRulers(this.rulers);
    if (result) {
      this.event.emit("rulersVisibility", true);
    }
    return result;
  }

  hideRulers(): boolean {
    const result = hideRulers(this.rulers);
    if (result) {
      this.event.emit("rulersVisibility", false);
    }
    return result;
  }

  areRulersVisible(): boolean {
    return areRulersVisible(this.rulers);
  }

  centerContent(): boolean {
    return centerContent(this.canvas, this.config, this.updateTransform.bind(this), this.transformLayer);
  }

  fitToScreen(): boolean {
    return fitToScreen(this.canvas, this.transformLayer, this.config);
  }

  getVisibleArea(): { x: number; y: number; width: number; height: number } {
    return getVisibleArea(this);
  }

  isPointVisible(x: number, y: number): boolean {
    return isPointVisible(this, x, y);
  }

  scrollToPoint(x: number, y: number): boolean {
    return scrollToPoint(this.canvas, this.config, x, y, this.updateTransform.bind(this), this.transformLayer);
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
    updateThemeMode(this.canvas.container, this.config, this.rulers, mode);
  }

  toggleThemeMode(): "light" | "dark" {
    const currentMode = this.config.themeMode;
    const newMode = currentMode === "light" ? "dark" : "light";
    this.updateThemeMode(newMode);
    return newMode;
  }

  // Transition management
  updateTransition(enabled: boolean): void {
    this.config = createMarkupCanvasConfig({ ...this.config, enableTransition: enabled });
  }

  toggleTransitionMode(): boolean {
    const newEnableTransition = toggleTransition(this.config.enableTransition);
    this.updateTransition(newEnableTransition);
    return newEnableTransition;
  }

  // Cleanup method
  cleanup(): void {
    cleanupWindowBinding(this.config);

    this.cleanupCallbacks.forEach((cleanup) => {
      try {
        cleanup();
      } catch (cleanupError) {
        console.warn("Error during cleanup:", cleanupError);
      }
    });
    this.cleanupCallbacks = [];

    // Remove all event listeners
    this.removeAllListeners();
  }

  // Event emitter delegation methods
  on<K extends keyof MarkupCanvasEvents>(event: K, handler: (data: MarkupCanvasEvents[K]) => void): void {
    this.event.on(event, handler);
  }

  off<K extends keyof MarkupCanvasEvents>(event: K, handler: (data: MarkupCanvasEvents[K]) => void): void {
    this.event.off(event, handler);
  }

  emit<K extends keyof MarkupCanvasEvents>(event: K, data: MarkupCanvasEvents[K]): void {
    this.event.emit(event, data);
  }

  removeAllListeners(): void {
    this.event.removeAllListeners();
  }

  destroy(): void {
    this.cleanup();

    if (window.__markupCanvasTransitionTimeout) {
      clearTimeout(window.__markupCanvasTransitionTimeout);
    }
  }
}
