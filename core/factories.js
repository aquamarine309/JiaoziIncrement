import { DC } from "./constants.js";

export function toggleAllFactories() {
  const areEnabled = Autobuyer.factory(1).isActive;
  for (let i = 1; i < 10; i++) {
    Autobuyer.factory(i).isActive = !areEnabled;
  }
}

export function factoryCommonMultiplier() {
  let multiplier = DC.D1;
  multiplier = multiplier.timesEffectsOf(
    Task.mixtures.reward,
    SimulationRebuyable.factoryBoost
  );
  return multiplier;
}

class FactoryState {
  constructor(tier) {
    this._tier = tier;
    this._getData = () => player.factories;
    const DISPLAY_NAMES = [null, 'micro', 'small', 'mediumSmall', 'medium', 'mediumLarge', 'large', 'giant', 'infinity', 'eternity'];
    this._displayName = DISPLAY_NAMES[tier];
    this._unlockRequirement = [DC.E25000, DC.E30000, DC.E32000, DC.E36000, DC.E52000, DC.E80000, DC.E100000, DC.E120000, DC.E150000][tier - 1];
    const COST_MULTS = [null, 1e3, 1e4, 1e7, 1e10, 1e14, 1e20, 1e25, 1e30, 1e45];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 10, 8, 6, 3, 3, 2, 2, 50, 50];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, DC.E90, DC.E110, DC.E125, DC.E150, DC.E220, DC.E280, DC.E385, DC.E465, DC.E550];
    this._baseCost = BASE_COSTS[tier];
  }
  get tier() { return this._tier; }

  get displayName() { return $t(this._displayName); }
  /** @returns {Decimal} */
  get cost() {
    return this.baseCost.times(Decimal.pow(this.costMultiplier, this.bought));
  }
  
  get name() {
    return `${this.displayName}${$t("scape")}${$t("factory_min")}`;
  }
  
   get data() { return this._getData()[this.tier - 1]; }
    /** @returns {Decimal} */
  get amount() { return this.data.amount; }
  /** @param {Decimal} value */
  set amount(value) { this.data.amount = value; }

  /** @returns {number} */
  get bought() { return this.data.bought; }
  /** @param {number} value */
  set bought(value) { this.data.bought = value; }
  
  get productionPerRealSecond() {
    return this.productionPerSecond;
  }

  productionForDiff(diff) {
    return this.productionPerSecond.times(diff / 1000);
  }

  produceCurrency(currency, diff) {
    currency.add(this.productionForDiff(diff));
  }

  produceFactories(factory, diff) {
    factory.amount = factory.amount.plus(this.productionForDiff(diff));
  }

  static get factoryCount() { return 9; }

  static createAccessor() {
    const index = Array.range(1, this.factoryCount).map(tier => new this(tier));
    index.unshift(null);
    const accessor = tier => index[tier];
    accessor.index = index;
    return accessor;
  }
  
  get isUnlocked() {
    return this.data.isUnlocked;
  }

  set isUnlocked(value) {
    this.data.isUnlocked = value;
  }

  get moneyRequirement() {
    return this._unlockRequirement;
  }

  get moneyRequirementReached() {
    return player.records.thisSimulation.maxMoney.gte(this.moneyRequirement);
  }

  get canUnlock() {
    return this.moneyRequirementReached;
  }

  get isAvailableForPurchase() {
    return Factories.canBuy() && this.isUnlocked && this.isAffordable && !this.isCapped;
  }

  get isAffordable() {
    return Currency.steamerCoins.gte(this.cost);
  }

  get rate() {
    const tier = this.tier;
    if (tier === 9) return DC.D0
    let toGain = DC.D0;
    toGain = Factory(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(2).dividedBy(current);
  }

  get productionPerSecond() {
    let production = this.amount;
    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;
    let mult = GameCache.factoryCommonMultiplier.value
    mult = mult.times(Decimal.pow(this.powerMultiplier, this.bought));
    if (this.tier <= 4) {
      mult = mult.timesEffectOf(SimulationMilestone.wrapperBoostFactories);
    }

    return mult.clampMin(1);
  }

  get isProducing() {
    const tier = this.tier;
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    let costMult = this._costMultiplier;
    return costMult;
  }

  get powerMultiplier() {
    return new Decimal(this._powerMultiplier).timesEffectOf(SimulationMilestone.buyingMakerBoost)
  }

  get purchases() {
    return this.data.bought;
  }

  get purchaseCap() {
    return Factories.capIncrease + (this.tier === 9
      ? Number.MAX_VALUE
      : Factories.HARDCAP_PURCHASES);
  }

  get isCapped() {
    return this.purchases >= this.purchaseCap;
  }

  get hardcapIPAmount() {
    return this._baseCost.times(Decimal.pow(this.costMultiplier, this.purchaseCap));
  }

  resetAmount() {
    this.amount = new Decimal(this.bought);
  }

  fullReset() {
    this.amount = DC.D0;
    this.bought = 0;
    this.isUnlocked = false;
  }

  unlock() {
    if (this.isUnlocked) return true;
    if (!this.canUnlock) return false;
    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.FACTORY_UNLOCKED, this.tier);
    if (this.tier === 1) {
      Tab.main.factory.show();
    }
    if (this.tier === 4 && !PlayerProgress.simulationUnlocked()) {
      Modal.message.show("你接到了几个外卖订单。请前往蒸笼界面查看。");
    }
    return true;
  }

  // Only ever called from manual actions
  buySingle() {
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;

    Currency.steamerCoins.purchase(this.cost);
    
    this.amount = this.amount.plus(1);
    this.bought += 1
    return true;
  }

  buyMax(auto) {
    if (!this.isAvailableForPurchase) return false;

    let purchasesUntilHardcap = this.purchaseCap - this.purchases;

    const costScaling = new LinearCostScaling(
      Currency.steamerCoins.value,
      this.cost,
      this.costMultiplier,
      purchasesUntilHardcap
    );

    if (costScaling.purchases <= 0) return false;

    Currency.steamerCoins.purchase(costScaling.totalCost);
    this.amount = this.amount.plus(costScaling.purchases);
    this.bought += costScaling.purchases

    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {InfinityFactoryState}
 */
export const Factory = FactoryState.createAccessor();

export const Factories = {
  /**
   * @type {InfinityFactoryState[]}
   */
  all: Factory.index.compact(),
  HARDCAP_PURCHASES: 2000000,

  unlockNext() {
    if (Factory(9).isUnlocked) return;
    this.next().unlock();
  },

  next() {
    if (Factory(9).isUnlocked)
      throw "All Factories are unlocked";
    return this.all.first(fac => !fac.isUnlocked);
  },

  resetAmount() {
    Currency.mixtures.reset();
    for (const factory of Factories.all) {
      factory.resetAmount();
    }
  },

  fullReset() {
    for (const factory of Factories.all) {
      factory.fullReset();
    }
  },

  get capIncrease() {
    return 0
  },

  get totalFacCap() {
    return this.HARDCAP_PURCHASES + this.capIncrease;
  },

  canBuy() {
    return true
  },

  canAutobuy() {
    return this.canBuy();
  },

  tick(diff) {
    for (let tier = 9; tier > 1; tier--) {
      Factory(tier).produceFactories(Factory(tier - 1), diff / 2);
    }
    Factory(1).produceCurrency(Currency.mixtures, diff);
  },

  tryAutoUnlock() {
    if (Factory(9).isUnlocked) return;
    for (const factory of this.all) {
      // If we cannot unlock this one, we can't unlock the rest, either
      if (!factory.unlock()) break;
    }
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to unlock factories
    const unlockedFactories = this.all.filter(factory => factory.unlock());

    // Try to buy single from the highest affordable new factories
    unlockedFactories.slice().reverse().forEach(factory => {
      if (factory.purchases === 0) factory.buySingle();
    });

    // Try to buy max from the lowest factory (since lower factories have bigger multiplier per purchase)
    unlockedFactories.forEach(factory => factory.buyMax(false));
  }
};
