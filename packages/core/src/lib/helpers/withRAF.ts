export function withRAF(operation: () => void): () => void {
  const rafId = requestAnimationFrame(() => {
    operation();
  });

  return () => {
    cancelAnimationFrame(rafId);
  };
}

export function withRAFThrottle<T extends (...args: unknown[]) => void>(func: T): T & { cleanup: () => void } {
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
