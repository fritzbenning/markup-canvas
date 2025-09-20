// RAF-based scheduler for batching DOM updates and animations
export class RAFScheduler {
  private pendingUpdates = new Set<() => void>();
  private rafId: number | null = null;
  private isScheduled = false;

  // Schedule a function to run on the next animation frame
  schedule(callback: () => void): void {
    this.pendingUpdates.add(callback);

    if (!this.isScheduled) {
      this.isScheduled = true;
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  // Cancel a scheduled callback
  cancel(callback: () => void): void {
    this.pendingUpdates.delete(callback);
  }

  // Execute all pending updates
  private flush(): void {
    const updates = Array.from(this.pendingUpdates);
    this.pendingUpdates.clear();
    this.isScheduled = false;
    this.rafId = null;

    // Execute all updates in a single frame
    for (const update of updates) {
      try {
        update();
      } catch (error) {
        console.error("RAF update failed:", error);
      }
    }
  }

  // Cancel all pending updates
  cancelAll(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingUpdates.clear();
    this.isScheduled = false;
  }
}

// Global RAF scheduler instance
export const rafScheduler = new RAFScheduler();

// RAF-based setTimeout replacement for better timing
export function rafTimeout(callback: () => void, delay: number): number {
  const startTime = performance.now();

  const tick = () => {
    const elapsed = performance.now() - startTime;
    if (elapsed >= delay) {
      callback();
    } else {
      requestAnimationFrame(tick);
    }
  };

  return requestAnimationFrame(tick);
}

// RAF-based throttle for high-frequency events
export function rafThrottle<T extends (...args: any[]) => void>(func: T, immediate = false): T {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId === null) {
      if (immediate) {
        func(...args);
      }

      rafId = requestAnimationFrame(() => {
        if (lastArgs && !immediate) {
          func(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };

  return throttled as T;
}
