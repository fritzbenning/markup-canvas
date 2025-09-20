import { MAX_ZOOM, MIN_ZOOM } from "../constants.js";

export interface ZoomInterpolationState {
  targetZoom: number;
  currentZoom: number;
  interpolationProgress: number;
  isInterpolating: boolean;
  lastUpdateTime: number;
}

/**
 * Smooth zoom interpolator for continuous zoom transitions
 */
export class SmoothZoomInterpolator {
  private state: ZoomInterpolationState = {
    targetZoom: 1.0,
    currentZoom: 1.0,
    interpolationProgress: 1.0,
    isInterpolating: false,
    lastUpdateTime: 0,
  };

  /**
   * Sets a new target zoom level with smooth interpolation
   */
  setTargetZoom(targetZoom: number, currentZoom: number): void {
    // Apply soft boundaries - slow down near limits instead of hard clamping
    const adjustedTarget = this.applySoftBoundaries(targetZoom);

    this.state.targetZoom = adjustedTarget;
    this.state.currentZoom = currentZoom;
    this.state.interpolationProgress = 0;
    this.state.isInterpolating = Math.abs(adjustedTarget - currentZoom) > 0.001;
    this.state.lastUpdateTime = performance.now();
  }

  /**
   * Gets the next interpolated zoom value
   */
  getInterpolatedZoom(timestamp: number = performance.now()): number {
    if (!this.state.isInterpolating) {
      return this.state.currentZoom;
    }
    this.state.lastUpdateTime = timestamp;

    // Use adaptive interpolation speed based on zoom range
    const zoomRange = Math.abs(this.state.targetZoom - this.state.currentZoom);
    const baseSpeed = 0.15; // Base interpolation speed
    const adaptiveSpeed = Math.min(baseSpeed * (1 + zoomRange * 0.5), 0.4);

    // Update interpolation progress
    this.state.interpolationProgress = Math.min(1.0, this.state.interpolationProgress + adaptiveSpeed);

    // Use smooth easing function for natural feel
    const easedProgress = this.easeOutCubic(this.state.interpolationProgress);

    // Calculate interpolated zoom
    const interpolatedZoom =
      this.state.currentZoom + (this.state.targetZoom - this.state.currentZoom) * easedProgress;

    // Check if interpolation is complete
    if (
      this.state.interpolationProgress >= 1.0 ||
      Math.abs(interpolatedZoom - this.state.targetZoom) < 0.001
    ) {
      this.state.isInterpolating = false;
      this.state.currentZoom = this.state.targetZoom;
      return this.state.targetZoom;
    }

    this.state.currentZoom = interpolatedZoom;
    return interpolatedZoom;
  }

  /**
   * Applies soft boundaries that slow down near limits instead of hard clamping
   */
  private applySoftBoundaries(zoom: number): number {
    const margin = 0.1; // Soft boundary margin
    const softMin = MIN_ZOOM + margin;
    const softMax = MAX_ZOOM - margin;

    if (zoom < softMin) {
      // Exponential approach to minimum
      const overshoot = softMin - zoom;
      return MIN_ZOOM + overshoot * 0.1;
    } else if (zoom > softMax) {
      // Exponential approach to maximum
      const overshoot = zoom - softMax;
      return MAX_ZOOM - overshoot * 0.1;
    }

    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  }

  /**
   * Smooth easing function for natural interpolation
   */
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Checks if currently interpolating
   */
  isCurrentlyInterpolating(): boolean {
    return this.state.isInterpolating;
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

  /**
   * Resets the interpolator
   */
  reset(zoom: number = 1.0): void {
    this.state = {
      targetZoom: zoom,
      currentZoom: zoom,
      interpolationProgress: 1.0,
      isInterpolating: false,
      lastUpdateTime: performance.now(),
    };
  }
}
