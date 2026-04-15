let emitImpl = null;

export const setRealtimeEmitter = (emitFn) => {
  emitImpl = typeof emitFn === 'function' ? emitFn : null;
};

export const emitRealtimeEvent = (eventName, payload) => {
  if (emitImpl) {
    emitImpl(eventName, payload);
  }
};
