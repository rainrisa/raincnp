import EventEmitter from "events";

declare global {
  var RainMatch: EventEmitter;
}
global.RainMatch = new EventEmitter();
