/**
 * T: The type of the event data.
 */
export interface EventEmitter<T extends Record<string, unknown>> {
  emit<K extends keyof T>(event: K, data: T[K]): Promise<unknown[]>;
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  onAll(handler: EventHandler<T[keyof T]>): void;
  offAll(handler: EventHandler<T[keyof T]>): void;
  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
}

/**
 * The type of the event handler.
 */
export type EventHandler<T> = (data: T) => unknown;

/**
 * define a event listener: event name and its handler
 */
export interface EventListener<T, K extends keyof T> {
  event: K;
  handler: EventHandler<T[K]>;
}

