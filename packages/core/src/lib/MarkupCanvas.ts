import { createCanvas } from "@/lib/canvas/index.js";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig.js";
import { EventEmitter } from "@/lib/events/EventEmitter.js";
import { setupKeyboardEvents, setupMouseEvents, setupTouchEvents, setupWheelEvents } from "@/lib/events/index.js";
import { getThemeValue, withClampedZoom, withFeatureEnabled } from "@/lib/helpers/index.js";
import { createRulers } from "@/lib/rulers/index.js";
import { withTransition } from "@/lib/transition/withTransition.js";
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
        this.broadcastEvent(event as string, data);
      });
      this.setupGlobalBinding();
    }

    this.setupEventHandlers();
    this._isReady = true;

    // Emit ready event
    this.listen.emit("ready", this);
  }

  private setupGlobalBinding(): void {
    if (typeof window === "undefined") {
      return;
    }

    const canvasName = this.config.name || "markupCanvas";
    const windowObj = window as unknown as Record<string, unknown>;

    // Bind instance to window
    windowObj[canvasName] = this;

    // Track all instances
    if (!windowObj.__markupCanvasInstances) {
      windowObj.__markupCanvasInstances = new Map();
    }
    (windowObj.__markupCanvasInstances as unknown as Map<string, MarkupCanvas>).set(canvasName, this);
  }

  private cleanupGlobalBinding(): void {
    if (typeof window === "undefined") {
      return;
    }

    const canvasName = this.config.name || "markupCanvas";
    const windowObj = window as unknown as Record<string, unknown>;

    delete windowObj[canvasName];
    if (windowObj.__markupCanvasInstances) {
      (windowObj.__markupCanvasInstances as unknown as Map<string, MarkupCanvas>).delete(canvasName);
    }
  }

  private broadcastEvent(event: string, data: unknown): void {
    if (typeof window === "undefined") {
      return;
    }

    window.postMessage(
      {
        source: "markup-canvas",
        event,
        data,
        timestamp: Date.now(),
        canvasName: this.config.name,
      },
      "*"
    );
  }

  private setupEventHandlers(): void {
    try {
      // Wheel zoom
      withFeatureEnabled(this.config, "enableZoom", () => {
        const wheelCleanup = setupWheelEvents(this, this.config);
        this.cleanupFunctions.push(wheelCleanup);
      });

      // Mouse events (drag and click-to-zoom)
      // Set up mouse events if either pan or click-to-zoom is enabled
      if (this.config.enablePan || this.config.enableClickToZoom) {
        this.dragSetup = setupMouseEvents(this, this.config, true);
        this.cleanupFunctions.push(this.dragSetup.cleanup);
      }

      // Keyboard navigation
      withFeatureEnabled(this.config, "enableKeyboard", () => {
        const keyboardCleanup = setupKeyboardEvents(this, this.config);
        this.cleanupFunctions.push(keyboardCleanup);
      });

      // Touch events (if enabled)
      withFeatureEnabled(this.config, "enableTouch", () => {
        const touchCleanup = setupTouchEvents(this);
        this.cleanupFunctions.push(touchCleanup);
      });

      // Set up rulers and grid
      withFeatureEnabled(this.config, "enableRulers", () => {
        this.rulers = createRulers(this.baseCanvas, this.config);
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

  // State management getters for React integration
  get isReady(): boolean {
    return this._isReady;
  }

  get isTransforming(): boolean {
    return this.dragSetup?.isEnabled() || false;
  }

  get visibleBounds(): { x: number; y: number; width: number; height: number } {
    return this.getVisibleArea();
  }

  getBounds(): CanvasBounds {
    return this.baseCanvas.getBounds();
  }

  updateTransform(newTransform: Partial<Transform>): boolean {
    const result = this.baseCanvas.updateTransform(newTransform);
    if (result) {
      this.emitTransformEvents();
    }
    return result;
  }

  private emitTransformEvents(): void {
    const transform = this.baseCanvas.transform;
    this.listen.emit("transform", transform);
    this.listen.emit("zoom", transform.scale);
    this.listen.emit("pan", { x: transform.translateX, y: transform.translateY });
  }

  reset(): boolean {
    return this.baseCanvas.reset();
  }

  handleResize(): boolean {
    return this.baseCanvas.handleResize();
  }

  setZoom(zoomLevel: number): boolean {
    return this.baseCanvas.setZoom(zoomLevel);
  }

  canvasToContent(x: number, y: number): { x: number; y: number } {
    return this.baseCanvas.canvasToContent(x, y);
  }

  zoomToPoint(x: number, y: number, targetScale: number): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      const result = this.baseCanvas.zoomToPoint(x, y, targetScale);
      if (result) {
        this.emitTransformEvents();
      }
      return result;
    });
  }

  resetView(): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      const result = this.baseCanvas.resetView ? this.baseCanvas.resetView() : false;
      if (result) {
        this.emitTransformEvents();
      }
      return result;
    });
  }

  zoomToFitContent(): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      const result = this.baseCanvas.zoomToFitContent();
      if (result) {
        this.emitTransformEvents();
      }
      return result;
    });
  }

  // Pan methods
  panLeft(distance?: number): boolean {
    const panDistance = distance ?? this.config.keyboardPanStep;
    const newTransform: Partial<Transform> = {
      translateX: this.baseCanvas.transform.translateX + panDistance,
    };
    return this.updateTransform(newTransform);
  }

  panRight(distance?: number): boolean {
    const panDistance = distance ?? this.config.keyboardPanStep;
    const newTransform: Partial<Transform> = {
      translateX: this.baseCanvas.transform.translateX - panDistance,
    };
    return this.updateTransform(newTransform);
  }

  panUp(distance?: number): boolean {
    const panDistance = distance ?? this.config.keyboardPanStep;
    const newTransform: Partial<Transform> = {
      translateY: this.baseCanvas.transform.translateY + panDistance,
    };
    return this.updateTransform(newTransform);
  }

  panDown(distance?: number): boolean {
    const panDistance = distance ?? this.config.keyboardPanStep;
    const newTransform: Partial<Transform> = {
      translateY: this.baseCanvas.transform.translateY - panDistance,
    };
    return this.updateTransform(newTransform);
  }

  // Zoom methods
  zoomIn(factor: number = 0.1): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      return withClampedZoom(this.config, (clamp) => {
        const newScale = clamp(this.baseCanvas.transform.scale * (1 + factor));
        const newTransform: Partial<Transform> = {
          scale: newScale,
        };
        return this.updateTransform(newTransform);
      });
    });
  }

  zoomOut(factor: number = 0.1): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      return withClampedZoom(this.config, (clamp) => {
        const newScale = clamp(this.baseCanvas.transform.scale * (1 - factor));
        const newTransform: Partial<Transform> = {
          scale: newScale,
        };
        return this.updateTransform(newTransform);
      });
    });
  }

  resetZoom(): boolean {
    return this.resetView();
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

  // Grid control methods
  toggleGrid(): boolean {
    if (this.rulers?.toggleGrid) {
      this.rulers.toggleGrid();
      return true;
    }
    return false;
  }

  showGrid(): boolean {
    if (this.rulers?.gridOverlay) {
      this.rulers.gridOverlay.style.display = "block";
      return true;
    }
    return false;
  }

  hideGrid(): boolean {
    if (this.rulers?.gridOverlay) {
      this.rulers.gridOverlay.style.display = "none";
      return true;
    }
    return false;
  }

  isGridVisible(): boolean {
    if (this.rulers?.gridOverlay) {
      return this.rulers.gridOverlay.style.display !== "none";
    }
    return false;
  }

  // Ruler control methods
  toggleRulers(): boolean {
    if (this.rulers) {
      const areVisible = this.areRulersVisible();
      if (areVisible) {
        this.rulers.hide();
      } else {
        this.rulers.show();
      }
      return true;
    }
    return false;
  }

  showRulers(): boolean {
    if (this.rulers) {
      this.rulers.show();
      return true;
    }
    return false;
  }

  hideRulers(): boolean {
    if (this.rulers) {
      this.rulers.hide();
      return true;
    }
    return false;
  }

  areRulersVisible(): boolean {
    if (this.rulers?.horizontalRuler) {
      return this.rulers.horizontalRuler.style.display !== "none";
    }
    return false;
  }

  // Utility methods
  centerContent(): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      const bounds = this.baseCanvas.getBounds();
      const centerX = (bounds.width - bounds.contentWidth * this.baseCanvas.transform.scale) / 2;
      const centerY = (bounds.height - bounds.contentHeight * this.baseCanvas.transform.scale) / 2;

      return this.updateTransform({
        translateX: centerX,
        translateY: centerY,
      });
    });
  }

  fitToScreen(): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      const result = this.baseCanvas.zoomToFitContent();
      if (result) {
        this.emitTransformEvents();
      }
      return result;
    });
  }

  getVisibleArea(): { x: number; y: number; width: number; height: number } {
    const bounds = this.baseCanvas.getBounds();
    return bounds.visibleArea;
  }

  isPointVisible(x: number, y: number): boolean {
    const visibleArea = this.getVisibleArea();
    return x >= visibleArea.x && x <= visibleArea.x + visibleArea.width && y >= visibleArea.y && y <= visibleArea.y + visibleArea.height;
  }

  scrollToPoint(x: number, y: number): boolean {
    return withTransition(this.transformLayer, this.config, () => {
      const bounds = this.baseCanvas.getBounds();
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      // Calculate new translation to center the point
      const newTranslateX = centerX - x * this.baseCanvas.transform.scale;
      const newTranslateY = centerY - y * this.baseCanvas.transform.scale;

      return this.updateTransform({
        translateX: newTranslateX,
        translateY: newTranslateY,
      });
    });
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
    const newConfig = {
      ...this.config,
      themeMode: mode,
    };
    this.config = createMarkupCanvasConfig(newConfig);

    // Update canvas background color
    const backgroundColor = getThemeValue(this.config, "canvasBackgroundColor");
    this.baseCanvas.container.style.backgroundColor = backgroundColor;

    // Update rulers if they exist
    if (this.rulers) {
      this.rulers.updateTheme(this.config);
    }
  }

  // Cleanup method
  cleanup(): void {
    this.cleanupGlobalBinding();
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
