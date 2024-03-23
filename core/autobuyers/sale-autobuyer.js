import { UpgradeableAutobuyerState } from "./autobuyer.js";

export class SaleAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.sale;
  }

  get name() {
    return "sale";
  }

  get isUnlocked() {
    return this.canBeUpgraded;
  }

  get canBeUpgraded() {
    return true
  }

  get baseInterval() {
    return Player.defaultStart.auto.sale.interval;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasAdditionalModes() {
    return true
  }

  get increaseWithMult() {
    return this.data.increaseWithMult;
  }

  set increaseWithMult(value) {
    this.data.increaseWithMult = value;
  }

  get amount() {
    return this.data.amount;
  }

  // This is unused mechanically, but should be zero to suppress the "Current bulk:" text
  get bulk() {
    return 0;
  }

  set amount(value) {
    this.data.amount = value;
  }

  get time() {
    return this.data.time;
  }

  set time(value) {
    this.data.time = value;
  }

  get xHighest() {
    return this.data.xHighest;
  }

  set xHighest(value) {
    this.data.xHighest = value;
  }

  upgradeInterval(free) {
    super.upgradeInterval(free);
  }

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
      this.amount = this.amount.times(mult);
    }
  }

  get canTick() {
    return Sale.isAvailable && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.STEAMER;
  }

  get highestPrevPrestige() {
    return player.records.thisBigReset.maxMoney;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisBigResetRealTime.totalSeconds, 0);
  }

  get willSale() {
    switch (this.mode) {
      case AUTO_SALE_MODE.AMOUNT:
        return gainedMoney().gte(this.amount);
      case AUTO_SALE_MODE.TIME:
        return Time.thisSaleRealTime.totalSeconds > this.time;
      case AUTO_SALE_MODE.X_HIGHEST:
      default:
        return gainedMoney().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    super.tick();
    if (this.willSale) saleReset(true);
  }

  reset() {
    super.reset();
    this.mode = AUTO_SALE_MODE.AMOUNT;
  }
}
