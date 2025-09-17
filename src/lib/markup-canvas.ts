import type { BaseCanvas, CanvasBounds, MarkupCanvasOptions, Transform } from "../types/index.js";
import { createCanvas } from "./canvas/index.js";
import {
  setupKeyboardNavigation,
  setupMouseDragWithControls,
  setupTouchEvents,
  setupWheelZoom,
} from "./events/index.js";
import { clampZoom } from "./matrix/zoom-clamping.js";
import { createRulers } from "./rulers/index.js";
import { disableSmoothTransitions, enableSmoothTransitions } from "./transform/index.js";

export class MarkupCanvas {
  private baseCanvas: BaseCanvas;
  private cleanupFunctions: (() => void)[] = [];
  private rulers: ReturnType<typeof createRulers> | null = null;
  private dragSetup: any;

  constructor(container: HTMLElement, options: MarkupCanvasOptions = {}) {
    if (!container) {
      throw new Error("Container element is required");
    }

    // Create base canvas
    const canvas = createCanvas(container, options);
    if (!canvas) {
      throw new Error("Failed to create canvas");
    }

    this.baseCanvas = canvas;
    this.setupEventHandlers(options);
    console.log("MarkupCanvas initialized successfully");
  }

  private setupEventHandlers(options: MarkupCanvasOptions): void {
    try {
      // Wheel zoom
      const wheelCleanup = setupWheelZoom(this.baseCanvas, {
        smoothTransition: options.smoothTransition !== undefined ? options.smoothTransition : true,
        zoomSpeed: options.zoomSpeed !== undefined ? options.zoomSpeed : 0.4,
        fineZoomSpeed: options.fineZoomSpeed !== undefined ? options.fineZoomSpeed : 0.2,
      });
      this.cleanupFunctions.push(wheelCleanup);

      // Mouse drag with control functions
      this.dragSetup = setupMouseDragWithControls(this.baseCanvas, {
        enableLeftDrag: options.enableLeftDrag !== undefined ? options.enableLeftDrag : true,
        enableMiddleDrag: options.enableMiddleDrag !== undefined ? options.enableMiddleDrag : true,
        requireSpaceForMouseDrag: options.requireSpaceForMouseDrag || false,
        enableClickToZoom: options.enableClickToZoom !== undefined ? options.enableClickToZoom : true,
        clickZoomLevel: options.clickZoomLevel !== undefined ? options.clickZoomLevel : 1.0,
        clickZoomDuration: options.clickZoomDuration !== undefined ? options.clickZoomDuration : 300,
        requireOptionForClickZoom:
          options.requireOptionForClickZoom !== undefined ? options.requireOptionForClickZoom : false,
      });
      this.cleanupFunctions.push(this.dragSetup.cleanup);

      // Keyboard navigation (optional)
      if (options.enableKeyboardControls !== false) {
        const keyboardCleanup = setupKeyboardNavigation(this as any, {
          panStep: 50,
          fastPanMultiplier: 3,
        });
        this.cleanupFunctions.push(keyboardCleanup);
      }

      // Touch events
      const touchCleanup = setupTouchEvents(this.baseCanvas, {
        enableSingleTouchPan: true,
        enableMultiTouch: true,
      });
      this.cleanupFunctions.push(touchCleanup);

      // Set up rulers and grid (if enabled)
      if (options.enableRulers !== false) {
        this.rulers = createRulers(this.baseCanvas, {
          showGrid: options.showGrid !== false,
          gridColor: options.gridColor || "rgba(0, 123, 255, 0.1)",
        });
        this.cleanupFunctions.push(() => {
          if (this.rulers) {
            this.rulers.destroy();
          }
        });
      }
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

  getBounds(): CanvasBounds {
    return this.baseCanvas.getBounds();
  }

  addContent(element: HTMLElement, options?: { x?: number; y?: number; absolute?: boolean }): boolean {
    return this.baseCanvas.addContent(element, options);
  }

  updateTransform(newTransform: Partial<Transform>): boolean {
    return this.baseCanvas.updateTransform(newTransform);
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

  setInteractionMode(mode: string): boolean {
    return this.baseCanvas.setInteractionMode(mode);
  }

  canvasToContent(x: number, y: number): { x: number; y: number } {
    return this.baseCanvas.canvasToContent(x, y);
  }

  zoomToPoint(x: number, y: number, targetScale: number, duration?: number): boolean {
    return this.baseCanvas.zoomToPoint(x, y, targetScale, duration);
  }

  resetView(duration?: number): boolean {
    return this.baseCanvas.resetView ? this.baseCanvas.resetView(duration) : false;
  }

  zoomToFitContent(duration?: number): boolean {
    return this.baseCanvas.zoomToFitContent(duration);
  }

  // Pan methods
  panLeft(distance: number = 50): boolean {
    const newTransform: Partial<Transform> = {
      translateX: this.baseCanvas.transform.translateX + distance,
    };
    return this.baseCanvas.updateTransform(newTransform);
  }

  panRight(distance: number = 50): boolean {
    const newTransform: Partial<Transform> = {
      translateX: this.baseCanvas.transform.translateX - distance,
    };
    return this.baseCanvas.updateTransform(newTransform);
  }

  panUp(distance: number = 50): boolean {
    const newTransform: Partial<Transform> = {
      translateY: this.baseCanvas.transform.translateY + distance,
    };
    return this.baseCanvas.updateTransform(newTransform);
  }

  panDown(distance: number = 50): boolean {
    const newTransform: Partial<Transform> = {
      translateY: this.baseCanvas.transform.translateY - distance,
    };
    return this.baseCanvas.updateTransform(newTransform);
  }

  // Zoom methods
  zoomIn(factor: number = 0.1): boolean {
    const newScale = clampZoom(this.baseCanvas.transform.scale * (1 + factor));
    const newTransform: Partial<Transform> = {
      scale: newScale,
    };
    return this.baseCanvas.updateTransform(newTransform);
  }

  zoomOut(factor: number = 0.1): boolean {
    const newScale = clampZoom(this.baseCanvas.transform.scale * (1 - factor));
    const newTransform: Partial<Transform> = {
      scale: newScale,
    };
    return this.baseCanvas.updateTransform(newTransform);
  }

  resetZoom(duration: number = 0): boolean {
    return this.resetView(duration);
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
  centerContent(duration: number = 300): boolean {
    const bounds = this.baseCanvas.getBounds();
    const centerX = (bounds.width - bounds.contentWidth * this.baseCanvas.transform.scale) / 2;
    const centerY = (bounds.height - bounds.contentHeight * this.baseCanvas.transform.scale) / 2;

    if (duration > 0) {
      enableSmoothTransitions(this.baseCanvas.transformLayer, duration / 1000);
    }

    const result = this.baseCanvas.updateTransform({
      translateX: centerX,
      translateY: centerY,
    });

    if (duration > 0) {
      setTimeout(() => {
        if (this.baseCanvas.transformLayer) {
          disableSmoothTransitions(this.baseCanvas.transformLayer);
        }
      }, duration + 50);
    }

    return result;
  }

  fitToScreen(duration: number = 300): boolean {
    return this.baseCanvas.zoomToFitContent(duration);
  }

  getVisibleArea(): { x: number; y: number; width: number; height: number } {
    const bounds = this.baseCanvas.getBounds();
    return bounds.visibleArea;
  }

  isPointVisible(x: number, y: number): boolean {
    const visibleArea = this.getVisibleArea();
    return (
      x >= visibleArea.x &&
      x <= visibleArea.x + visibleArea.width &&
      y >= visibleArea.y &&
      y <= visibleArea.y + visibleArea.height
    );
  }

  scrollToPoint(x: number, y: number, duration: number = 300): boolean {
    const bounds = this.baseCanvas.getBounds();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    // Calculate new translation to center the point
    const newTranslateX = centerX - x * this.baseCanvas.transform.scale;
    const newTranslateY = centerY - y * this.baseCanvas.transform.scale;

    if (duration > 0) {
      enableSmoothTransitions(this.baseCanvas.transformLayer, duration / 1000);
    }

    const result = this.baseCanvas.updateTransform({
      translateX: newTranslateX,
      translateY: newTranslateY,
    });

    if (duration > 0) {
      setTimeout(() => {
        if (this.baseCanvas.transformLayer) {
          disableSmoothTransitions(this.baseCanvas.transformLayer);
        }
      }, duration + 50);
    }

    return result;
  }

  // Cleanup method
  cleanup(): void {
    this.cleanupFunctions.forEach((cleanup) => {
      try {
        cleanup();
      } catch (cleanupError) {
        console.warn("Error during cleanup:", cleanupError);
      }
    });
    this.cleanupFunctions = [];
  }

  // Alias for cleanup to match common patterns
  destroy(): void {
    this.cleanup();
  }
}
