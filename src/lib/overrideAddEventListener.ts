export const overrideAddEventListener = () => {
  const oldAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function newAddEventListener(
    eventName,
    eventHandler,
    options
  ) {
    if (eventHandler === null) return;

    let newEventHandler = eventHandler;
    if (!eventName.match(/^react-/) && !eventName.match(/^message/)) {
      newEventHandler = function(e: Event) {
        if (typeof eventHandler === "function") eventHandler(e);
        else eventHandler.handleEvent(e);
      };
    }
    oldAddEventListener.call(this, eventName, newEventHandler, options);
  };
};
