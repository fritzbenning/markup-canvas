import type { EventCanvas as Canvas } from "../../types/index.js";
import { getZoomToMouseTransform } from "../matrix/zoom-to-mouse.js";

export interface ContinuousZoomState {
  isActive: boolean;
  targetZoom: number;
  currentZoom: number;
  centerX: number;
  centerY: number;
  rafId: number | null;
  lastUpdateTime: number;
}

/**
 * Continuous zoom updater for smooth zoom transitions during gestures
 */
export class ContinuousZoomUpdater {
  private state: ContinuousZoomState = {
    isActive: false,
    targetZoom: 1.0,
    currentZoom: 1.0,
    centerX: 0,
    centerY: 0,
    rafId: null,
    lastUpdateTime: 0,
  };

  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * Starts continuous zoom updates
   */
  startContinuousZoom(targetZoom: number, centerX: number, centerY: number): void {
    this.state.targetZoom = targetZoom;
    this.state.currentZoom = this.canvas.transform.scale;
    this.state.centerX = centerX;
    this.state.centerY = centerY;
    this.state.lastUpdateTime = performance.now();

    if (!this.state.isActive) {
      this.state.isActive = true;
      this.scheduleUpdate();
    }
  }

  /**
   * Updates the target zoom during an ongoing gesture
   */
  updateTargetZoom(targetZoom: number, centerX: number, centerY: number): void {
    this.state.targetZoom = targetZoom;
    this.state.centerX = centerX;
    this.state.centerY = centerY;

    if (!this.state.isActive) {
      this.startContinuousZoom(targetZoom, centerX, centerY);
    }
  }

  /**
   * Stops continuous zoom updates
   */
  stopContinuousZoom(): void {
    this.state.isActive = false;
    if (this.state.rafId !== null) {
      cancelAnimationFrame(this.state.rafId);
      this.state.rafId = null;
    }
  }

  /**
   * Schedules the next update
   */
  private scheduleUpdate(): void {
    if (!this.state.isActive) return;

    this.state.rafId = requestAnimationFrame((timestamp) => {
      this.performUpdate(timestamp);

      // Continue updating if still active and not at target
      if (this.state.isActive && Math.abs(this.state.currentZoom - this.state.targetZoom) > 0.001) {
        this.scheduleUpdate();
      } else {
        this.state.isActive = false;
        this.state.rafId = null;
      }
    });
  }

  /**
   * Performs a single zoom update
   */
  private performUpdate(timestamp: number): void {
    const deltaTime = timestamp - this.state.lastUpdateTime;
    this.state.lastUpdateTime = timestamp;

    // Calculate interpolation speed based on zoom difference
    const zoomDiff = Math.abs(this.state.targetZoom - this.state.currentZoom);
    const baseSpeed = 0.2; // Base interpolation speed
    const adaptiveSpeed = Math.min(baseSpeed * (1 + zoomDiff * 0.3), 0.5);

    // Interpolate towards target zoom
    const direction = this.state.targetZoom > this.state.currentZoom ? 1 : -1;
    const step = zoomDiff * adaptiveSpeed;

    if (step < 0.001) {
      this.state.currentZoom = this.state.targetZoom;
    } else {
      this.state.currentZoom += direction * step;
    }

    // Calculate zoom factor for transform
    const zoomFactor = this.state.currentZoom / this.canvas.transform.scale;

    // Apply the zoom transform
    if (Math.abs(zoomFactor - 1.0) > 0.001) {
      const newTransform = getZoomToMouseTransform(
        this.state.centerX,
        this.state.centerY,
        this.canvas.transform,
        zoomFactor,
      );

      this.canvas.updateTransform(newTransform);
    }
  }

  /**
   * Checks if currently updating
   */
  isUpdating(): boolean {
    return this.state.isActive;
  }

  /**
   * Gets current zoom level
   */
  getCurrentZoom(): number {
    return this.state.currentZoom;
  }

  /**
   * Gets target zoom level
   */
  getTargetZoom(): number {
    return this.state.targetZoom;
  }
}
