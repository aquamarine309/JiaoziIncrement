import { UpgradeableAutobuyerState } from "./autobuyer.js";

export class BigResetAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.bigReset;
  }

  get name() {
    return "collection";
  }

  get isUnlocked() {
    return this.canBeUpgraded;
  }

  get canBeUpgraded() {
    return PlayerProgress.steamerUnlocked()
  }

  get baseInterval() {
    return Player.defaultStart.auto.bigReset.interval;
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
    return Stuffing.bigResetCheck && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.STEAMER;
  }

  get highestPrevPrestige() {
    return player.records.thisBigReset.maxMoney;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisSteamerRealTime.totalSeconds, 0);
  }

  get willReset() {
    switch (this.mode) {
      case AUTO_BIG_RESET_MODE.AMOUNT:
        return gainedCols() >= this.amount;
      case AUTO_BIG_RESET_MODE.TIME:
        return Time.thisBigResetRealTime.totalSeconds > this.time;
      case AUTO_BIG_RESET_MODE.X_HIGHEST:
      default:
        return gainedMoney().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    super.tick();
    if (this.willReset) requestBigReset();
  }

  reset() {
    super.reset();
    this.mode = AUTO_BIG_RESET_MODE.AMOUNT;
  }
}
