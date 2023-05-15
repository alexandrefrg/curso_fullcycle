import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface {
  private _eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

  get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
    return this._eventHandlers;
  }
  register(
    eventName: string,
    eventhandler: EventHandlerInterface<EventInterface>
  ): void {
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(eventhandler);
  }
  unregister(
    eventName: string,
    eventhandler: EventHandlerInterface<EventInterface>
  ): void {
    if (this._eventHandlers[eventName]) {
      const index = this._eventHandlers[eventName].indexOf(eventhandler);
      if (index !== -1) {
        this._eventHandlers[eventName].splice(index, 1);
      }
    }
  }
  unregisterAll(): void {
    this._eventHandlers = {};
  }
  notify(event: EventInterface): void {
    const eventName = event.constructor.name;
    if (this._eventHandlers[eventName])
      this._eventHandlers[eventName].forEach(
        (eventHandler: EventHandlerInterface) => {
          eventHandler.handle(event);
        }
      );
  }
}
