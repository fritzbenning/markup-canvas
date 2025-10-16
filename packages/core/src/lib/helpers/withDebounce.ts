const debounceTimers = new Map<string, number>();

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
