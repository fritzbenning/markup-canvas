/**
 * Schedules `operation` to run on the next animation frame and returns a function that cancels the scheduled frame.
 */
export function withRAF(operation: () => void): () => void {
  const rafId = requestAnimationFrame(() => {
    operation();
  });

  return () => {
    cancelAnimationFrame(rafId);
  };
}

/**
 * Returns a throttled variant of `func` that runs at most once per animation frame with the latest arguments.
 * The returned function has a `cleanup` method to cancel any pending frame.
 */
export function withRAFThrottle<T extends (...args: unknown[]) => void>(
  func: T,
): T & { cleanup: () => void } {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          func(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };

  throttled.cleanup = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      lastArgs = null;
    }
  };

  return throttled as T & { cleanup: () => void };
}
