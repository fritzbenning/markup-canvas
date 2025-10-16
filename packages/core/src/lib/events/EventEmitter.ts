export class EventEmitter<Events extends Record<string, unknown>> {
  private listeners: Map<keyof Events, Set<(data: unknown) => void>> = new Map();

  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as (data: unknown) => void);
  }

  off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler as (data: unknown) => void);
    }
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for "${String(event)}":`, error);
        }
      });
    }
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}
