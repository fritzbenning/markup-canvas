/**
 * Minimal typed pub/sub for canvas lifecycle and transform notifications.
 *
 * Handlers are stored per event name; {@link EventEmitter.emit} invokes all subscribers and swallows per-handler errors after logging. An optional interceptor runs synchronously before listeners on each emit.
 *
 * @typeParam Events - Map of event names to payload types; must be compatible with `Record<string, unknown>` (e.g. {@link MarkupCanvasEvents}).
 */
export interface EventEmitter<Events extends Record<string, unknown>> {
  /**
   * Registers a callback invoked for every emit before listeners run (e.g. logging or devtools).
   */
  setEmitInterceptor(interceptor: (event: keyof Events, data: unknown) => void): void;

  /**
   * Subscribes to an event. Duplicate handlers for the same `event` are allowed.
   */
  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void;

  /**
   * Removes a previously registered handler (same reference as passed to {@link EventEmitter.on}).
   */
  off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void;

  /**
   * Dispatches `data` to the optional interceptor, then all handlers for `event`. Handler exceptions are caught and logged; other handlers still run.
   */
  emit<K extends keyof Events>(event: K, data: Events[K]): void;

  /**
   * Unsubscribes every handler for every event.
   */
  removeAllListeners(): void;
}

/**
 * Creates a typed event bus backed.
 */
export function createEventEmitter<Events extends Record<string, unknown>>(): EventEmitter<Events> {
  const listeners = new Map<keyof Events, Set<(data: unknown) => void>>();
  let emitInterceptor: ((event: keyof Events, data: unknown) => void) | undefined;

  return {
    setEmitInterceptor(interceptor: (event: keyof Events, data: unknown) => void): void {
      emitInterceptor = interceptor;
    },

    on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler as (data: unknown) => void);
    },

    off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
      const handlers = listeners.get(event);
      if (handlers) {
        handlers.delete(handler as (data: unknown) => void);
      }
    },

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
      emitInterceptor?.(event, data);

      const handlers = listeners.get(event);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(data);
          } catch (error) {
            console.error(`Error in event handler for "${String(event)}":`, error);
          }
        });
      }
    },

    removeAllListeners(): void {
      listeners.clear();
    },
  };
}
