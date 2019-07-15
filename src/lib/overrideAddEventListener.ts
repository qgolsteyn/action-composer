export const overrideAddEventListener = () => {
  const oldAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function newAddEventListener(
    eventName,
    eventHandler,
    options
  ) {
    if (eventHandler === null) return;

    let newEventHandler = eventHandler;
    if (!eventName.match(/^react-/)) {
      newEventHandler = function(e: Event) {
        (window as any).events = [];
        (window as any).events.push({ type: eventName, payload: e });
        if (typeof eventHandler === "function") eventHandler(e);
        else eventHandler.handleEvent(e);
        console.table((window as any).events);
      };
    }
    oldAddEventListener.call(this, eventName, newEventHandler, options);
  };
};
