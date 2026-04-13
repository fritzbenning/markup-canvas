const debounceTimers = new Map<string, number>();

/**
 * Debounces `operation` by `delay` ms, keyed by `key`. A new call with the same key resets the timer.
 * Uses a module-level map of timers (not per-instance).
 */
export function withDebounce(key: string, delay: number, operation: () => void): void {
  const existingTimer = debounceTimers.get(key);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = window.setTimeout(() => {
    operation();
    debounceTimers.delete(key);
  }, delay);

  debounceTimers.set(key, timer);
}
