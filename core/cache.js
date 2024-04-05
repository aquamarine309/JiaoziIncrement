class Lazy {
  constructor(getValue) {
    this._getValue = getValue;
    Lazy.registerLazy(this);
  }

  static get registrar() {
    if (Lazy._registrar === undefined) {
      Lazy._registrar = [];
    }
    return Lazy._registrar;
  }

  static registerLazy(object) {
    Lazy.registrar.push(object);
  }

  static invalidateAll() {
    for (const obj of Lazy.registrar) {
      obj.invalidate();
    }
  }

  get value() {
    if (this._value === undefined) {
      this._value = this._getValue();
    }
    return this._value;
  }

  invalidate() {
    this._value = undefined;
  }

  /**
   * @return {Lazy}
   */
  invalidateOn(...events) {
    for (const event of events) {
      EventHub.logic.on(event, () => this.invalidate());
    }
    return this;
  }
}
window.Lazy = Lazy;

export const GameCache = {
  cheapestMakerAutobuyer: new Lazy(() => Autobuyer.maker.zeroIndexed.concat(
    Autobuyer.wrapper,
    Autobuyer.stuffing,
    Autobuyer.sale
   )
    .filter(ab => !(ab.isBought || ab.isUnlocked))
    .map(ab => ab.moneyCost.toNumber())
    .min()
  ),
  
  normalChallengeTimeSum: new Lazy(() => player.challenge.normal.bestTimes.sum()),
  
  totalSCMult: new Lazy(() => totalSCMult()),
  
  totalCoresMult: new Lazy(() => totalCoresMult()),
  
  makerCommonMultiplier: new Lazy(() => makerCommonMultiplier()),
  
  makerFinalMultipliers: Array.range(0, 10)
    .map(tier => new Lazy(() => getMakerFinalMultiplierUncached(tier))),

  factoryCommonMultiplier: new Lazy(() => factoryCommonMultiplier()),
  
  collectionPresets: new Lazy(() => player.collectionPresets.map(cp => new CollectionPreset(cp)).compact()),
  
  totalEnergyMult: new Lazy(() => totalEnergyMult()),
  
  totalSimulationRebuyablesBought: new Lazy(
    () => SimulationRebuyableGroup.upgrades.reduce((a, u) => a + u.boughtAmount, 0)
  )
};

GameCache.makerFinalMultipliers.invalidate = function() {
  for (const x of this) x.invalidate();
};