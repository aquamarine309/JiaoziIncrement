import { AutobuyerState } from "./autobuyer.js";

export class SteamerAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.steamer;
  }

  get name() {
    return `蒸笼`;
  }

  maxIntervalForFree() {}
  
  get isUnlocked() {
    return SteamerUpgrade.unlockSteamerAuto.isBought;
  }

  get baseInterval() {
    return Player.defaultStart.auto.steamer.interval;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasAdditionalModes() {
    return false
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

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
      this.amount = this.amount.times(mult);
    }
  }

  get canTick() {
    return Player.canFixSteamer && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.SIMULATION;
  }

  get highestPrevPrestige() {
    return player.records.thisSteamer.maxMoney;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisSteamerRealTime.totalSeconds, 0);
  }

  get willReset() {
    switch (this.mode) {
      case AUTO_STEAMER_MODE.AMOUNT:
        return gainedSteamerCoins().gte(this.amount);
      case AUTO_STEAMER_MODE.TIME:
        return Time.thisBigResetRealTime.totalSeconds > this.time;
      case AUTO_STEAMER_MODE.X_HIGHEST:
      default:
        return gainedSteamerCoins().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    if (this.willReset) steamerRequest();
  }

  reset() {
    super.reset();
    this.mode = AUTO_STEAMER_MODE.AMOUNT;
  }
}
