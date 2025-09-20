/**
 * Tracks gesture velocity for smoother interactions
 */
export class VelocityTracker {
  private samples: Array<{ value: number; timestamp: number }> = [];
  private maxSamples: number;

  constructor(maxSamples: number = 10) {
    this.maxSamples = maxSamples;
  }

  /**
   * Add a new sample
   */
  addSample(value: number, timestamp: number = performance.now()): void {
    this.samples.push({ value, timestamp });

    // Keep only the most recent samples
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  /**
   * Get current velocity (change per millisecond)
   */
  getVelocity(): number {
    if (this.samples.length < 2) {
      return 0;
    }

    const recent = this.samples.slice(-3); // Use last 3 samples for stability
    if (recent.length < 2) {
      return 0;
    }

    const first = recent[0];
    const last = recent[recent.length - 1];

    const deltaValue = last.value - first.value;
    const deltaTime = last.timestamp - first.timestamp;

    return deltaTime > 0 ? deltaValue / deltaTime : 0;
  }

  /**
   * Get smoothed velocity using weighted average
   */
  getSmoothedVelocity(): number {
    if (this.samples.length < 2) {
      return 0;
    }

    let totalWeight = 0;
    let weightedSum = 0;

    // Calculate velocity between consecutive samples with recency weighting
    for (let i = 1; i < this.samples.length; i++) {
      const prev = this.samples[i - 1];
      const curr = this.samples[i];

      const deltaValue = curr.value - prev.value;
      const deltaTime = curr.timestamp - prev.timestamp;

      if (deltaTime > 0) {
        const velocity = deltaValue / deltaTime;
        const weight = i; // More recent samples get higher weight

        weightedSum += velocity * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Clear all samples
   */
  clear(): void {
    this.samples = [];
  }

  /**
   * Get the number of samples
   */
  getSampleCount(): number {
    return this.samples.length;
  }
}
