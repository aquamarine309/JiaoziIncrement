import { DC } from "../constants.js";

import { UpgradeableAutobuyerState } from "./autobuyer.js";

export class WrapperAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.wrapper;
  }

  get name() {
    return $t("wrapper");
  }

  get isUnlocked() {
    return this.canBeUpgraded;
  }

  get canBeUpgraded() {
    return PlayerProgress.collectionUnlocked();
  }

  get baseInterval() {
    return Player.defaultStart.auto.wrapper.interval;
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
    if (NormalChallenge(3).isRunning) return
    this.mode = [
      AUTOBUYER_MODE.BUY_SINGLE,
      AUTOBUYER_MODE.BUY_MAX
    ]
      .nextSibling(this.mode);
  }

  get canTick() {
    return Wrapper.isSatisfied && Wrapper.canBeBought && super.canTick;
  }

  tick() {
    super.tick();
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        buySingleWrapper();
        break;
      case AUTOBUYER_MODE.BUY_MAX:
        buyMaxWrapper();
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
  
  //这行代码别删，因为下面的set会把原先的get弄没，要重新写一遍才能保证自动饺子皮可以正常切换
  get isActive() {
    return super.isActive
  }
  
  set isActive(value) {
    if (NormalChallenge(3).isRunning) return
    this.data.isActive = value
  }

  reset() {
    super.reset();
    this.data.mode = AUTOBUYER_MODE.BUY_SINGLE;
    this.data.isUnlocked = false;
    this.data.isBought = false;
    TabNotification.newAutobuyer.clearTrigger();
  }
}
