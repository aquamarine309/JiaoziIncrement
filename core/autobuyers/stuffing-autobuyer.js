import { DC } from "../constants.js";

import { UpgradeableAutobuyerState } from "./autobuyer.js";

export class StuffingAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.stuffing;
  }

  get name() {
    return $t("stuffing");
  }

  get isUnlocked() {
    return this.canBeUpgraded;
  }

  get canBeUpgraded() {
    return PlayerProgress.collectionUnlocked();
  }

  get baseInterval() {
    return Player.defaultStart.auto.stuffing.interval;
  }

  get isBought() {
    return this.data.isBought;
  }

  get moneyCost() {
    return DC.E200;
  }

  get canBeBought() {
    return true;
  }

  get disabledByContinuum() {
    return false;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasUnlimitedBulk() {
    return this.mode === AUTOBUYER_MODE.BUY_MAX;
  }

  get canUnlockSlowVersion() {
    return player.records.thisBigReset.maxMoney.gte(this.moneyCost);
  }

  toggleMode() {
    this.mode = [
      AUTOBUYER_MODE.BUY_SINGLE,
      AUTOBUYER_MODE.BUY_MAX
    ]
      .nextSibling(this.mode);
  }

  get canTick() {
    return Stuffing.isSatisfied && Stuffing.canBeBought && !Stuffing.canBigReset && super.canTick;
  }

  tick() {
    super.tick();
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        manualRequestStuffing();
        break;
      case AUTOBUYER_MODE.BUY_MAX:
        manualRequestStuffing(Infinity);
        break;
    }
  }

  purchase() {
    if (!this.canUnlockSlowVersion) return;
    this.data.isBought = true;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.STEAMER;
  }

  reset() {
    super.reset();
    this.data.mode = AUTOBUYER_MODE.BUY_SINGLE;
    this.data.isUnlocked = false;
    this.data.isBought = false;
    //TabNotification.newAutobuyer.clearTrigger();
  }
}
