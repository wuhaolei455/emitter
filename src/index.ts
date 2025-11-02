import { EventEmitter, EventHandler, EventListener } from "./types";


export function createEventEmitter<T extends Record<string, unknown>>(): EventEmitter<T> {
  const listeners: EventListener<T, any>[] = [];

  function emit<K extends keyof T>(event: K, data: T[K]): Promise<unknown[]> {
    let listener: EventListener<T, keyof T> | undefined;
    const results: Promise<unknown>[] = [];
    const filteredListeners = listeners.filter((l) => l.event === event || l.event === "all");

    for (listener of filteredListeners) {
      const res = listener.handler(data);
      if ((<Promise<unknown>>res)?.then) {
        results.push(<Promise<unknown>>res);
      }
    }

    return Promise.all(results);
  }

  function on<K extends keyof T>(event: K, handler: EventHandler<T[K]>) {
    const listener = <EventListener<T, K>>{ event, handler };
    listeners.push(listener);
  }

  function off<K extends keyof T>(event: K, handler: EventHandler<T[K]>) {
    const ndx = listeners.findIndex(
      (l: EventListener<T, K>) => event === l.event && handler === l.handler
    );

    if (ndx !== -1) {
      listeners.splice(ndx, 1);
    }
  }

  function onAll(handler: EventHandler<T[keyof T]>) {
    const listener = <EventListener<T, keyof T>>{ event: "all", handler };
    listeners.push(listener);
  }

  function offAll(handler: EventHandler<T[keyof T]>) {
    const ndx = listeners.findIndex(
      (l: EventListener<T, keyof T>) => 'all' === l.event && handler === l.handler
    );

    if (ndx !== -1) {
      listeners.splice(ndx, 1);
    }
  }
  
  function once<K extends keyof T>(event: K, callback: EventHandler<T[K]>) {
    const wrappedHandler: EventHandler<T[K]> = (data: T[K]) => {
      off(event, wrappedHandler);
      return callback(data);
    };

    const listener: EventListener<T, K> = {
      event,
      handler: wrappedHandler,
    };
    listeners.push(listener);
  }

  const emitter: EventEmitter<T> = {
    emit: emit,
    on: on,
    off: off,
    onAll: onAll,
    offAll: offAll,
    once: once,
  };

  return emitter;
}