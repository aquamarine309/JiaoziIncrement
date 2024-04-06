import { DC } from './constants.js';

export function dilatedValueOf(value) {
  const log10 = value.log10();
  const dilationPenalty = 0.725;
  return Decimal.pow10(Math.sign(log10) * Math.pow(Math.abs(log10), dilationPenalty));
}

export function makerCommonMultiplier() {
  let multiplier = DC.D1;
  
  multiplier = multiplier.times(Achievements.power)
  multiplier = multiplier.times(Wrapper.power);
  multiplier = multiplier.timesEffectsOf(
    Achievement(21),
    Collections.iteration,
    Collections.fire,
    SteamerUpgrade.steamerCountMult,
    SteamerUpgrade.timeBoost,
    NormalChallenge(6),
    MixtureTypes.sauses,
    NormalChallenge(7).reward,
    SimulationRebuyable.makerBoost
  )
  return multiplier;
}

export function getMakerFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 9) throw new Error(`Invalid Maker tier ${tier}`);
  
  if (NormalChallenge(7).isRunning && player.postC7Tier !== tier) {
    return DC.D1;
  }
  
  let multiplier = DC.D1;

  multiplier = applyMakerMultipliers(multiplier, tier);
  multiplier = applyMakerPowers(multiplier, tier);

  if (NormalChallenge(8).isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
 
  return multiplier;
}

function applyMakerMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.makerCommonMultiplier.value);

  multiplier = multiplier.times(Decimal.pow(Makers.buyOneMultiplier, Maker(tier).bought));

  multiplier = multiplier.clampMin(1);

  return multiplier;
}

function applyMakerPowers(mult, tier) {
  let multiplier = mult;
  multiplier = multiplier.powEffectOf(SteamerUpgrade.makerPow);
  multiplier = multiplier.powEffectOf(NormalChallenge(4));

  return multiplier;
}


class MakerState {
  /**@param {Number} tier */
  constructor(tier) {
    const baseCost = [null, 10, 1e4, 5e7, 2e14, 1e22, 1e34, 1e46, 1e55, 1e120];
    const baseIncrease = [null, 1.5, 4, 8, 16, 1e4, 1e9, 1e16, 1e25, 1e40];
    this._tier = tier;
    this._baseCost = baseCost[tier];
    this._baseIncrease = baseIncrease[tier];
  }
  
  get name() {
    return $t("jMaker") + (this.tier === 1 ? "" : formatPow(this.tier));
  }
  
  get baseCost() {
    return this._baseCost;
  }
  
  get baseIncrease() {
    return this._baseIncrease;
  }
  
  get tier() {
    return this._tier;
  }
  
  get data() {
    return player.makers[this.tier - 1];
  }
  
  get amount() {
    return this.data.amount;
  }
  
  set amount(value) {
    this.data.amount = value;
  }
  
  get productionPerSecond() {
    return this.amount.times(this.multiplier);
  }
  
  get costScale() {
    let increase = this.baseIncrease;
    return new ExponentialCostScaling({
      baseCost: this.baseCost,
      baseIncrease: increase,
      costScale: 5,
      scalingCostThreshold: 1e50
    })
  }
  
  tick(diff) {
    if (!this.isAvailable) return;
    if ((!player.break || Player.isInNormalChallenge) && Currency.jiaozi.gte(Player.steamerGoal)) return;
    if (this.tier === 1) {
      Currency.jiaozi.add(this.productionForDiff(diff));
    } else {
      Maker(this.tier - 1).add(this.productionForDiff(diff / 2));
    }
  }
  
  get bought() {
    return this.data.bought;
  }
  
  set bought(value) {
    this.data.bought = value;
  }
  
  get multiplier() {
    return GameCache.makerFinalMultipliers[this.tier].value;
  }
  
  get cost() {
    return this.costScale.calculateCost(this.bought);
  }
  
  get isAffordable() {
    if (!player.break && this.cost.gt(Decimal.NUMBER_MAX_VALUE)) return false;
    return Makers.currency.gte(this.cost);
  }
  
  get rate() {
    if (this.tier >= Makers.maxTier) return DC.D0;
    return Maker(this.tier + 1).productionPerSecond.div(this.amount.clampMin(1)).div(2);
  }
  
  add(amount, bought = false) {
    this.amount = this.amount.add(amount);
    if (bought) this.bought += amount;
  }
  
  productionForDiff(diff) {
    return this.productionPerSecond.times(diff / 1e3);;
  }
  
  get isAvailable() {
    return this.tier <= Makers.maxTier;
  }
  
  reset() {
    this.bought = 0;
    this.amount = DC.D0;
  }
  
  static createAccessor() {
    const index = Array.range(1, 9).map(tier => new this(tier));
    index.unshift(null);
    const accessor = tier => index[tier];
    accessor.index = index;
    return accessor;
  }
}

export const Maker = MakerState.createAccessor();

export const Makers = {
  /**@type {MakerState[]} */
  all: Maker.index.compact(),
  
  get maxTier() {
    return Math.min(Stuffing.amount + 1, this.totalTier);
  },
  
  get totalTier() {
    return 9;
  },
  
  get currencyType() {
    return player.makerCurrencyType;
  },
  
  set currencyType(value) {
    player.makerCurrencyType = value;
  },
  
  get currency() {
    switch (this.currencyType) {
      case MAKER_CURRENCY.JIAOZI: 
        return Currency.jiaozi;
      case MAKER_CURRENCY.MONEY:
        return Currency.money;
    }
  },
  
  get currencyName() {
    switch (this.currencyType) {
      case MAKER_CURRENCY.JIAOZI: 
        return $t("jiaozi");
      case MAKER_CURRENCY.MONEY:
        return $t("money");
    }
  },
  
  toggle() {
    if (!SimulationUpgrade.moneyMaker.isBought) return;
    this.currencyType = [
      MAKER_CURRENCY.JIAOZI,
      MAKER_CURRENCY.MONEY
    ].nextSibling(this.currencyType);
  },
  
  get buyOneMultiplier() {
    let multiplier = DC.D1_02;
    multiplier = multiplier.timesEffectsOf(
      Collections.fast,
      SimulationMilestone.buyingMakerBoost
    );
    return multiplier;
  },
  
  tick(diff) {
    const hasCap = !player.break || Player.isInNormalChallenge;
    if (hasCap && Currency.jiaozi.gte(Player.steamerGoal)) return;
    this.all.forEach(m => m.tick(diff));
    
    if (hasCap) Currency.jiaozi.dropTo(Player.steamerGoal);
  },
  
  reset() {
    this.all.forEach(m => m.reset());
  }
}

export function buySingleMaker(tier) {
  const maker = Maker(tier);
  if (!maker.isAffordable || !maker.isAvailable) return;
  Makers.currency.minus(maker.cost);
  maker.add(1, true);
  onBuyMaker(tier);
}

export function resetJiaozi() {
  Currency.jiaozi.reset();
}

export function makeJiaozi() {
  const pps = Maker(1).productionPerSecond;
  const tapJiaoziAmount = pps.times(0.5).timesEffectOf(Collections.antimatter);
  Currency.jiaozi.add(tapJiaoziAmount);
}

export function buyMaxMaker(tier, bulk = Infinity) {
  if (bulk <= 0) return;
  const maker = Maker(tier);
  const cost = maker.cost;
  const maxBought = maker.costScale.getMaxBought(maker.bought, Makers.currency.value, 1);
  if (maxBought === null) return;
  let buying = maxBought.quantity;
  if (buying > bulk) buying = bulk;
  Makers.currency.subtract(Decimal.pow10(maxBought.logPrice));
  maker.add(buying, true);
  onBuyMaker(tier);
}

export function maxAll() {
  for (let tier = Makers.maxTier; tier >= 1; tier--) {
    buyMaxMaker(tier);
  }
}

function onBuyMaker(tier) {
  if (tier === 1) Tutorial.turnOffEffect(TUTORIAL_STATE.MAKER1);
  if (NormalChallenge(7).isRunning) player.postC7Tier = tier;
  if (tier < 9) Achievement(10 + tier).unlock();
  else Achievement(25).unlock();
}