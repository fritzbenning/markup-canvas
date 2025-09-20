import { GESTURE_SMOOTHING } from "../constants.js";
import { SmoothZoomInterpolator } from "./smooth-zoom-interpolator.js";
import { VelocityTracker } from "./velocity-tracker.js";

export interface GestureState {
  lastZoomFactor: number;
  velocityHistory: number[];
  lastTimestamp: number;
  momentum: number;
  direction: number; // 1 for zoom in, -1 for zoom out, 0 for no change
  smoothedZoomFactor: number;
}

export class GestureSmoother {
  private state: GestureState = {
    lastZoomFactor: 1.0,
    velocityHistory: [],
    lastTimestamp: 0,
    momentum: 0,
    direction: 0,
    smoothedZoomFactor: 1.0,
  };

  private velocityTracker = new VelocityTracker(8);
  private zoomInterpolator = new SmoothZoomInterpolator();

  /**
   * Smooths zoom factor changes for better gesture handling with continuous interpolation
   */
  smoothZoomFactor(
    rawZoomFactor: number,
    currentScale: number,
    timestamp: number = performance.now(),
  ): number {
    const deltaTime = timestamp - this.state.lastTimestamp;

    // Skip if too little time has passed
    if (deltaTime < 1) {
      return this.zoomInterpolator.getInterpolatedZoom(timestamp);
    }

    // Add sample to velocity tracker
    this.velocityTracker.addSample(rawZoomFactor, timestamp);

    // Get smoothed velocity
    const velocity = this.velocityTracker.getSmoothedVelocity();

    // Detect direction changes
    const newDirection = rawZoomFactor > 1 ? 1 : rawZoomFactor < 1 ? -1 : 0;
    const directionChanged =
      this.state.direction !== 0 && newDirection !== 0 && this.state.direction !== newDirection;

    // Reset momentum on direction change for immediate responsiveness
    if (directionChanged) {
      this.state.momentum = 0;
      this.velocityTracker.clear();
      this.velocityTracker.addSample(rawZoomFactor, timestamp);
    } else {
      // Update momentum with decay
      this.state.momentum =
        this.state.momentum * GESTURE_SMOOTHING.MOMENTUM_DECAY +
        velocity * (1 - GESTURE_SMOOTHING.MOMENTUM_DECAY);
    }

    // Calculate target zoom based on raw input and momentum
    let targetZoom = currentScale * rawZoomFactor;

    // Apply momentum for continuous gestures
    if (Math.abs(this.state.momentum) > GESTURE_SMOOTHING.VELOCITY_THRESHOLD && !directionChanged) {
      const momentumContribution = this.state.momentum * deltaTime * 0.02;
      targetZoom *= 1 + momentumContribution;
    }

    // Set target for smooth interpolation
    this.zoomInterpolator.setTargetZoom(targetZoom, currentScale);

    // Get interpolated zoom value
    const smoothedZoom = this.zoomInterpolator.getInterpolatedZoom(timestamp);

    // Calculate smoothed zoom factor from the interpolated zoom
    const smoothedZoomFactor = smoothedZoom / currentScale;

    // Update state
    this.state.lastZoomFactor = rawZoomFactor;
    this.state.smoothedZoomFactor = smoothedZoomFactor;
    this.state.lastTimestamp = timestamp;
    this.state.direction = newDirection;

    return smoothedZoomFactor;
  }

  /**
   * Resets the gesture state (call on gesture start)
   */
  reset(currentZoom: number = 1.0): void {
    this.state = {
      lastZoomFactor: 1.0,
      velocityHistory: [],
      lastTimestamp: performance.now(),
      momentum: 0,
      direction: 0,
      smoothedZoomFactor: 1.0,
    };
    this.velocityTracker.clear();
    this.zoomInterpolator.reset(currentZoom);
  }

  /**
   * Gets current momentum for debugging
   */
  getMomentum(): number {
    return this.state.momentum;
  }

  /**
   * Gets current direction for debugging
   */
  getDirection(): number {
    return this.state.direction;
  }

  /**
   * Gets current velocity for debugging
   */
  getVelocity(): number {
    return this.velocityTracker.getSmoothedVelocity();
  }
}
