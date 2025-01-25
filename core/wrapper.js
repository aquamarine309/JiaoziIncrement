import { DC } from "./constants.js"

export class Wrapper {
  static get name() {
    if (Collections.golden.isEffectActive) return $t("gWrapper");
    return $t("wrapper");
  }

  static get cost() {
    if (this.amount >= 1000) {
      return Decimal.pow(4, Decimal.pow(this.amount - 1000, 2).add(71000)).times(200).dividedByEffectOf(Collections.dragon);
    }
    const baseAmount = this.amount + Math.pow(this.amount, 2) / 400;
    const scaleAmount = this.amount > 100 ? 
    Math.pow(this.amount - 100, 2) / 12 : 0;
    return Decimal.pow(4, baseAmount + scaleAmount).times(200).dividedByEffectOf(Collections.dragon);
  }

  static get base() {
    let base = new Decimal(2).sqrt();
    base = base.timesEffectsOf(
      Collections.golden,
      Achievement(35),
      SimulationRebuyable.wrapperBoost
    );
    base = base.powEffectOf(NormalChallenge(5));
    base = base.powEffectOf(NormalChallenge(5).reward);
    if (NormalChallenge(7).isRunning && player.postC7Tier !== 0) base = base.pow(0.65);
    return base;
  }

  static get freeAmount() {
    return Collections.cat.effectOrDefault(0) * Stuffing.amount;
  }

  static get power() {
    return Decimal.pow(this.base, this.totalAmount);
  }

  static get amount() {
    return player.wrapper;
  }

  static set amount(value) {
    player.wrapper = value;
  }

  static get totalAmount() {
    return this.amount + this.freeAmount;
  }

  static get cap() {
    return Infinity;
  }

  static get canBeBought() {
    if (this.amount >= this.cap) return false;
    if (NormalChallenge(1).isRunning) return false;
    return true;
  }

  static get isSatisfied() {
    return Currency.money.gte(this.cost);
  }

  static add(amount) {
    this.amount += amount;
  }

  static reset() {
    this.amount = 0;
  }

  static get unlockedText() {
    if (NormalChallenge(1).isRunning) return $t("lockedC1")
    return $t("locked");
  }
}

export function buySingleWrapper() {
  if (!Wrapper.canBeBought || !Wrapper.isSatisfied) return false;
  Tutorial.turnOffEffect(TUTORIAL_STATE.WRAPPER);
  player.postC7Tier = 0;
  player.money = player.money.minus(Wrapper.cost);
  Wrapper.add(1);
  return true;
}

export function buyMaxWrapper() {
  if (!Wrapper.canBeBought) return;
  if (Currency.money.lt(Wrapper.cost)) return;
  const logMoney = player.money.div(200).timesEffectOf(Collections.dragon).log(4);
  if (Wrapper.amount >= 1000) {
    Wrapper.amount = Math.max(Math.floor(Math.sqrt(logMoney - 71000)) + 1001, Wrapper.amount);
    player.postC7Tier = 0;
    return;
  }
  const base = 6 * Math.sqrt(10 * logMoney + 900) - 180;
  let bought;
  if (base <= 100) bought = Math.floor(base);
  else bought = Math.floor((2820 + 2 * Math.sqrt(2790 * logMoney - 336900)) / 31);

  if (bought >= 1000) {
    Wrapper.amount = 1000;
    buyMaxWrapper();
    return;
  }

  if (bought - Wrapper.amount >= 3) {
    Wrapper.amount = bought;
  }

  while (Wrapper.canBeBought && Wrapper.isSatisfied) {
    buySingleWrapper();
  }
}
