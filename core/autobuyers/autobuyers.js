import { MakerAutobuyerState } from "./maker-autobuyer.js";
import { SaleAutobuyerState } from "./sale-autobuyer.js";
import { WrapperAutobuyerState } from "./wrapper-autobuyer.js";
import { StuffingAutobuyerState } from "./stuffing-autobuyer.js";
import { BigResetAutobuyerState } from "./big-reset-autobuyer.js";
import { SteamerAutobuyerState } from "./steamer-autobuyer.js";
import { SCMultAutobuyerState } from "./prestige-currency-multiplier-autobuyer.js";
import { TaskAutobuyerState } from "./task-autobuyer.js";
import { FactoryAutobuyerState } from "./factory-autobuyer.js";

export const Autobuyer = {
  maker: MakerAutobuyerState.createAccessor(),
  sale: new SaleAutobuyerState(),
  wrapper: new WrapperAutobuyerState(),
  stuffing: new StuffingAutobuyerState(),
  bigReset: new BigResetAutobuyerState(),
  steamer: new SteamerAutobuyerState(),
  scMult: new SCMultAutobuyerState(),
  task: TaskAutobuyerState.createAccessor(),
  factory: FactoryAutobuyerState.createAccessor()
};
export const Autobuyers = (function() {
  const makers = Autobuyer.maker.zeroIndexed;
  const factories = Autobuyer.factory.zeroIndexed;
  const prestige = [
    Autobuyer.stuffing,
    Autobuyer.bigReset,
    Autobuyer.steamer,
    Autobuyer.sale
  ];

  const single = [
    Autobuyer.scMult
  ];

  const singleComplex = [
    Autobuyer.wrapper
  ].concat(single);

  const arrays = [
    Autobuyer.task.zeroIndexed
  ];
  const all = makers.concat(factories, prestige, singleComplex, arrays);
  const multiple = [
    Autobuyer.maker,
    Autobuyer.factory,
    Autobuyer.task
  ]

  return {
    all: all.flat(),
    display: [multiple, single],
    upgradeable: makers.concat(
      Autobuyer.sale,
      Autobuyer.wrapper,
      Autobuyer.bigReset,
      Autobuyer.stuffing
    ),

    get unlocked() {
      return Autobuyers.all.filter(a => a.isUnlocked || a.isBought);
    },

    get hasAutobuyersForEditModal() {
      return [
        Autobuyer.sale,
        Autobuyer.bigReset,
        Autobuyer.steamer
      ].some(autobuyer => autobuyer.isUnlocked);
    },

    toggle() {
      if (NormalChallenge(3).isRunning) return
      player.auto.autobuyersOn = !player.auto.autobuyersOn;
    },

    tick() {
      if (!player.auto.autobuyersOn) return;
      PerformanceStats.start("Autobuyers");

      // The canTick condition must be checked after the previous autobuyer has triggered
      // in order to avoid slow dimension autobuyers.
      for (const autobuyer of Autobuyers.all) {
        if (autobuyer.canTick) autobuyer.tick();
      }

      PerformanceStats.end();
    },

    resetTick(prestigeEvent) {
      const autobuyers = Autobuyers.all.filter(n => n.resetTick !== undefined);
      for (const autobuyer of autobuyers) {
        autobuyer.resetTick(prestigeEvent);
      }
    },

    reset() {
      for (const autobuyer of Autobuyers.all) {
        autobuyer.reset();
      }
    }
  };
}());

EventHub.logic.on(GAME_EVENT.SALE_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.SALE));
EventHub.logic.on(GAME_EVENT.STUFFING_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.STUFFING));
EventHub.logic.on(GAME_EVENT.BIG_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.BIG_RESET));
