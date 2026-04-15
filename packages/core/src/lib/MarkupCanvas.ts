import { centerContent, pan, panToPoint } from "@/lib/actions/pan/index";
import { checkGridVisibility, hideGrid, showGrid, toggleGrid, toggleTransition, updateThemeMode } from "@/lib/actions/ui/index";
import { checkRulersVisibility, hideRulers, showRulers, toggleRulers } from "@/lib/actions/ui/rulers/index";
import { fitToScreen, resetViewToCenter, setZoom, zoomIn, zoomOut, zoomToPoint } from "@/lib/actions/zoom/index";
import { createCanvas, getCanvasBounds } from "@/lib/canvas";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { createEventEmitter } from "@/lib/events/createEventEmitter";
import { emitTransformEvents } from "@/lib/events/emitTransformEvents";
import { setupKeyboardEvents, setupMouseEvents, setupPostMessageEvents, setupTouchEvents, setupWheelEvents } from "@/lib/events/index";
import type { KeyboardScope } from "@/lib/events/keyboard/types";
import { sendPostMessage } from "@/lib/events/postMessage/utils/sendPostMessage";
import { getVisibleArea, isPointVisible, withFeatureEnabled } from "@/lib/helpers";
import { canvasToContent } from "@/lib/matrix/canvasToContent";
import { createMatrix } from "@/lib/matrix/createMatrix";
import { createRulers } from "@/lib/rulers/index";
import { resetTransform, updateTransform } from "@/lib/transform/index";
import { cleanupWindowBinding } from "@/lib/window/cleanupWindowBinding";
import { bindCanvasToWindow } from "@/lib/window/index";
import type { Canvas, CanvasBounds, MarkupCanvasConfig, MarkupCanvasEvents, MouseDragControls, Transform } from "@/types/index";

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
  private keyboardCleanup: (() => void) | null = null;
  private keyboardScope: KeyboardScope = "default";
  public config: Required<MarkupCanvasConfig>;
  public event = createEventEmitter<MarkupCanvasEvents>();
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

    withFeatureEnabled(this.config, "enableRulers", () => {
      this.rulers = createRulers(this, this.config);
      this.cleanupCallbacks.push(() => {
        if (this.rulers) {
          this.rulers.destroy();
        }
      });
    });

    // Always bind canvas to window
    this.event.setEmitInterceptor((event, data) => {
      const eventName = event as string;
      const payload = eventName === "ready" ? { ready: true } : data;
      const canvasName = this.config.name || "markupCanvas";

      sendPostMessage(canvasName, eventName, payload, { target: "both" });
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
        const keyboardCleanup = setupKeyboardEvents(this, this.config, {
          keyboardScope: this.keyboardScope,
        });
        this.keyboardCleanup = keyboardCleanup;
        this.cleanupCallbacks.push(keyboardCleanup);
      });

      // Touch events
      withFeatureEnabled(this.config, "enableTouch", () => {
        const touchCleanup = setupTouchEvents(this);
        this.cleanupCallbacks.push(touchCleanup);
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
    const result = resetTransform(this.canvas, this.transformLayer, this.config);
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
    const result = zoomToPoint(this.canvas, this.transformLayer, this.config, x, y, targetScale);
    if (result) {
      emitTransformEvents(this.event, this.canvas);
    }
    return result;
  }

  panLeft(distance?: number): boolean {
    const update = this.updateTransform.bind(this);
    return (
      pan("left", this.canvas, this.config, update) ||
      (distance ? pan("left", this.canvas, { ...this.config, keyboardPanStep: distance }, update) : false)
    );
  }

  panRight(distance?: number): boolean {
    const update = this.updateTransform.bind(this);
    return (
      pan("right", this.canvas, this.config, update) ||
      (distance ? pan("right", this.canvas, { ...this.config, keyboardPanStep: distance }, update) : false)
    );
  }

  panUp(distance?: number): boolean {
    const update = this.updateTransform.bind(this);
    return (
      pan("up", this.canvas, this.config, update) ||
      (distance ? pan("up", this.canvas, { ...this.config, keyboardPanStep: distance }, update) : false)
    );
  }

  panDown(distance?: number): boolean {
    const update = this.updateTransform.bind(this);
    return (
      pan("down", this.canvas, this.config, update) ||
      (distance ? pan("down", this.canvas, { ...this.config, keyboardPanStep: distance }, update) : false)
    );
  }

  panToPoint(x: number, y: number): boolean {
    return panToPoint(this.canvas, this.config, x, y, this.updateTransform.bind(this), this.transformLayer);
  }

  zoomIn(): boolean {
    return zoomIn(this, this.transformLayer, this.config, this.zoomToPoint.bind(this));
  }

  zoomOut(): boolean {
    return zoomOut(this, this.transformLayer, this.config, this.zoomToPoint.bind(this));
  }

  resetZoom(): boolean {
    return resetViewToCenter(this, this.transformLayer, this.config, this.zoomToPoint.bind(this));
  }

  centerContent(): boolean {
    return centerContent(this.canvas, this.config, this.updateTransform.bind(this), this.transformLayer);
  }

  fitToScreen(): boolean {
    const result = fitToScreen(this.canvas, this.transformLayer, this.config);
    if (result) {
      emitTransformEvents(this.event, this.canvas);
    }
    return result;
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

  // Keyboard control methods
  enableKeyboard(): boolean {
    if (this.keyboardCleanup) {
      return true; // Already enabled
    }
    this.keyboardCleanup = setupKeyboardEvents(this, this.config, {
      keyboardScope: this.keyboardScope,
    });
    this.cleanupCallbacks.push(this.keyboardCleanup);
    return true;
  }

  disableKeyboard(): boolean {
    if (this.keyboardCleanup) {
      this.keyboardCleanup();
      this.keyboardCleanup = null;
      return true;
    }
    return false;
  }

  isKeyboardEnabled(): boolean {
    return this.keyboardCleanup !== null;
  }

  /**
   * Restricts keyboard shortcuts (pan/zoom off; reset, grid, rulers still on) so
   * nested inputs can handle typing without the canvas stealing keys.
   * Same as `setKeyboardScope("restricted")`.
   */
  enableTextEditMode(): boolean {
    return this.setKeyboardScope("restricted");
  }

  /** Restores the full canvas shortcut set. Same as `setKeyboardScope("default")`. */
  disableTextEditMode(): boolean {
    return this.setKeyboardScope("default");
  }

  /** True when the restricted shortcut set is active (e.g. while nested content is being edited). */
  isTextEditModeEnabled(): boolean {
    return this.keyboardScope === "restricted";
  }

  /** Sets which keyboard shortcuts are active; rebinds the listener when keyboard is enabled. */
  setKeyboardScope(scope: KeyboardScope): boolean {
    if (this.keyboardScope === scope) {
      return true;
    }
    this.keyboardScope = scope;

    if (this.keyboardCleanup) {
      const index = this.cleanupCallbacks.indexOf(this.keyboardCleanup);
      if (index > -1) {
        this.cleanupCallbacks.splice(index, 1);
      }
      this.keyboardCleanup();
      this.keyboardCleanup = setupKeyboardEvents(this, this.config, {
        keyboardScope: this.keyboardScope,
      });
      this.cleanupCallbacks.push(this.keyboardCleanup);
    }

    return true;
  }

  getKeyboardScope(): KeyboardScope {
    return this.keyboardScope;
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
    return checkGridVisibility(this.rulers);
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
    return checkRulersVisibility(this.rulers);
  }

  getVisibleArea(): { x: number; y: number; width: number; height: number } {
    return getVisibleArea(this);
  }

  isPointVisible(x: number, y: number): boolean {
    return isPointVisible(this, x, y);
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
    updateThemeMode(this.config, this.rulers, mode);
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

  updateRequireSpaceForMouseDrag(enabled: boolean): void {
    this.config = createMarkupCanvasConfig({ ...this.config, requireSpaceForMouseDrag: enabled });
  }

  updateEnableClickToZoom(enabled: boolean): void {
    this.config = createMarkupCanvasConfig({ ...this.config, enableClickToZoom: enabled });
  }

  updateRequireOptionForClickZoom(enabled: boolean): void {
    this.config = createMarkupCanvasConfig({ ...this.config, requireOptionForClickZoom: enabled });
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
