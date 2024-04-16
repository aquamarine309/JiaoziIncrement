window.EventHub = class EventHub {
  constructor() {
    this._handlers = {};
  }

  on(event, fn, target) {
    if (!event) console.warn(target);
    let handlers = this._handlers[event];
    if (handlers === undefined) {
      handlers = [];
      this._handlers[event] = handlers;
    }
    handlers.push({ fn, target });
  }

  offAll(target) {
    for (const handlers of Object.keys(this._handlers)) {
      this._handlers[handlers] = this._handlers[handlers]
        .filter(handler => handler.target !== target);
    }
  }

  dispatch(event, args) {
    if (!event) console.warn(args);
    const handlers = this._handlers[event];
    if (handlers === undefined) return;
    for (const handler of handlers) {
      handler.fn(args);
    }
  }

  static dispatch(event, ...args) {
    if (!event) console.warn(args);
    EventHub.logic.dispatch(event, args);
    GameUI.dispatch(event, args);
  }

  static get stats() {
    // For debug/profiling purposes
    function countHandlers(eventHub) {
      return Object.values(eventHub._handlers)
        .map(handlers => handlers.length)
        .sum();
    }
    return `UI(UPDATE/Total): ${EventHub.ui._handlers[GAME_EVENT.UPDATE].length}/${countHandlers(EventHub.ui)}; ` +
      `Logic(Total): ${countHandlers(EventHub.logic)}`;
  }
};

EventHub.logic = new EventHub();
EventHub.ui = new EventHub();

window.GAME_EVENT = {
  // Ticks
  GAME_TICK_BEFORE: "GAME_TICK_BEFORE",
  GAME_TICK_AFTER: "GAME_TICK_AFTER",

  // Resets
  SALE_BEFORE: 'SALE_BEFORE',
  SALE_AFTER: 'SALE_AFTER',
  STUFFING_BEFORE: 'STUFFING_BEFORE',
  STUFFING_AFTER: 'STUFFIMG_AFTER',
  BIG_RESET_BEFORE: 'BIG_RESET_BEFORE',
  BIG_RESET_AFTER: 'BIG_RESET_AFTER',
  FIX_STEAMER_BEFORE: "FIX_STEAMER_BEFORE",
  FIX_STEAMER_AFTER: "FIX_STEAMER_AFTER",
  CONCLUDE_SIMULATION_BEFORE: "CONCLUDE_SIMULATION_BEFORE",
  CONCLUDE_SIMULATION_AFTER: "CONCLUDE_SIMULATION_AFTER",

  // Break Infinity
  BREAK_INFINITY: "BREAK_INFINITY",
  FIX_INFINITY: "FIX_INFINITY",

  // Other
  STEAMER_UPGRADE_BOUGHT: "STEAMER_UPGRADE_BOUGHT",
  COMPLETE_CHALLENGE: "COMPLETE_CHALLENGE",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  CHALLENGE_FAILED: "CHALLENGE_FAILED",
  GAME_LOAD: "GAME_LOAD",
  OFFLINE_CURRENCY_GAINED: "OFFLINE_CURRENCY_GAINED",
  STEAMER_UPGRADE_BOUGHT: "STEAMER_UPGRADE_BOUGHT",
  COMPLETE_TASK: "COMPLETE_TASK",
  NORMAL_CHALLENGE_START: "NORMAL_CHALLENGE_START",
  NORMAL_CHALLENGE_COMPLETED: "NORMAL_CHALLENGE_COMPLETED",
  UPDATE_COLLECTION_PRESETS_AFTER: "UPDATE_COLLECTION_PRESETS_AFTER",

  // Used by events to signify that they are triggered by a particular
  // event, not handled by the event hub
  ACHIEVEMENT_EVENT_OTHER: "ACHIEVEMENT_EVENT_OTHER",
  FACTORY_UNLOCKED: "FACTORY_UNLOCKED",
  ENTER_PRESSED: "ENTER_PRESSED",
  ARROW_KEY_PRESSED: "ARROW_KEY_PRESSED",

  // UI Events
  UPDATE: "UPDATE",
  TAB_CHANGED: "TAB_CHANGED",
  CLOSE_MODAL: "CLOSE_MODAL",
};
