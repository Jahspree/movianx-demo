export class EventBus {
  constructor({ logger = console } = {}) {
    this.logger = logger;
    this.listeners = new Map();
  }

  on(eventName, handler) {
    if (!eventName || typeof handler !== "function") return () => {};
    const listeners = this.listeners.get(eventName) || new Set();
    listeners.add(handler);
    this.listeners.set(eventName, listeners);
    return () => this.off(eventName, handler);
  }

  once(eventName, handler) {
    const unsubscribe = this.on(eventName, payload => {
      unsubscribe();
      handler(payload);
    });
    return unsubscribe;
  }

  off(eventName, handler) {
    const listeners = this.listeners.get(eventName);
    if (!listeners) return;
    listeners.delete(handler);
    if (!listeners.size) this.listeners.delete(eventName);
  }

  emit(eventName, payload = {}) {
    const event = {
      type: eventName,
      ts: Date.now(),
      payload,
    };
    this.log("runtime:event", event);
    const listeners = [...(this.listeners.get(eventName) || [])];
    listeners.forEach(handler => {
      try {
        handler(event.payload, event);
      } catch (error) {
        this.log("runtime:event-listener-failed", {
          eventName,
          error: error?.message || String(error),
        }, "error");
      }
    });
    return event;
  }

  log(type, data = {}, level = "info") {
    const entry = { type, ts: Date.now(), ...data };
    const method = this.logger?.[level] || this.logger?.log;
    if (typeof method === "function") method.call(this.logger, "[MovianxRuntime]", entry);
    return entry;
  }

  clear() {
    this.listeners.clear();
  }
}

export default EventBus;
