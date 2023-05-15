import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default interface EventDispatcherInterface {
  register(eventName: string, eventhandler: EventHandlerInterface): void;
  unregister(eventName: string, eventhandler: EventHandlerInterface): void;
  unregisterAll(): void;
  notify(event: EventInterface): void;
}
