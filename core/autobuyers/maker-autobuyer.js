import { DC } from "../constants.js";

import { UpgradeableAutobuyerState } from "./autobuyer.js";

export class MakerAutobuyerState extends UpgradeableAutobuyerState {
  get tier() {
    return this.id;
  }

  get name() {
    return `${$t("maker")}${this.tier === 1 ? "" : formatPow(this.tier)}`
  }

  get fullName() {
    return Maker(this.tier).name;
  }

  get data() {
    return player.auto.makers.all[this.tier - 1];
  }

  get baseInterval() {
    return Player.defaultStart.auto.makers.all[this.tier - 1].interval;
  }

  get isUnlocked() {
    return this.data.isBought || this.canBeUpgraded;
  }

  get isBought() {
    return this.data.isBought;
  }

  get moneyCost() {
    return DC.E20.pow(this.tier - 1).times(DC.E80);
  }

  get canBeBought() {
    const bigReset = PlayerProgress.collectionUnlocked()
    if (this.tier <= 4) return bigReset
    if (this.tier === 5) return bigReset && Collections.adofai.isUnlocked
    if (this.tier > 5) return bigReset && SteamerUpgrade[`nextMaker${this.tier - 5}`].isBought
  }

  get canBeUpgraded() {
    return this.data.isBought;
  }

  get disabledByContinuum() {
    return false;
  }

  get bulk() {
    // Use 1e100 to avoid issues with Infinity.
    return this.hasUnlimitedBulk ? 1e100 : Math.clampMax(this.data.bulk, this.bulkCap);
  }

  get hasUnlimitedBulk() {
    return true;
  }

  get bulkCap() {
    return 512;
  }

  get hasMaxedBulk() {
    return this.bulk >= this.bulkCap;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
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

  // We don't want to directly call super.canTick here because the game logic works really weirdly in terms of
  // interactions between individual and group AD autobuyers. The UI can change and certain settings can become
  // unmodifiable in some conditions. This is basically the lowest-effort solution to support legacy behavior
  // because the proper alternatve of an AD autobuyer refactor to untangle this mess is likely not worth the effort
  get canTick() {
    // AD autobuyer-specific logic; if the UI is collapsed then we are unable to toggle groupSetting.
    // In terms of UX for this case it makes the most sense to ignore it and pretend it's true
    const settingConfig = player.auto.makers;
    const individualSetting = settingConfig.all[this.tier - 1];
    const groupSetting = settingConfig.isActive;
    const thisSetting = individualSetting && (Autobuyer.maker.collapseDisplay ? groupSetting : true);

    // General availability
    const maker = Maker(this.tier);
    const hasAutobuyer = maker.isAvailable && maker.isAffordable;

    // From IntervaledAutobuyerState.canTick
    const intervalTick = this.timeSinceLastTick >= this.interval;

    // From AutobuyerState.canTick (ignores this.constructor.isActive because that's accounted for in thisSetting)
    const autoTick = player.auto.autobuyersOn && this.isActive && (this.isUnlocked || this.isBought);
    return thisSetting && hasAutobuyer && intervalTick && autoTick;
  }

  tick() {
    super.tick();
    const tier = this.tier;
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        buySingleMaker(tier);
        break;
      case AUTOBUYER_MODE.BUY_MAX:
        buyMaxMaker(tier, this.bulk);
        break;
    }
  }

  upgradeBulk() {
    if (this.hasMaxedBulk) return;
    if (!Currency.money.purchase(this.cost)) return;
    this.data.bulk = Math.clampMax(this.bulk * 2, this.bulkCap);
    this.data.cost = Math.ceil(2.4e12 * this.cost);
    GameUI.update();
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
    this.data.isUnlocked = false;
    this.data.isBought = false;
    this.data.bulk = 1;
    //TabNotification.newAutobuyer.clearTrigger();
  }

  static get entryCount() { return 9; }
  static get autobuyerGroupName() { return $t("jMakers"); }

  // These are toggled on and off from the group autobuyer checkbox
  static get isActive() { return player.auto.makers.isActive; }
  static set isActive(value) { player.auto.makers.isActive = value; }

  static createAccessor() {
    const accessor = super.createAccessor();
    Object.defineProperties(accessor, {
      allBought: { get: () => accessor.zeroIndexed.every(x => x.isBought) },
      // We can get away with this since allUnlimitedBulk is the same for all AD autos
      allUnlimitedBulk: { get: () => accessor.zeroIndexed[0].hasUnlimitedBulk },
      bulkCap: { get: () => accessor.zeroIndexed[0].bulkCap },
      collapseDisplay: { get: () => accessor.allMaxedInterval && accessor.allUnlocked && accessor.allUnlimitedBulk }
    });
    return accessor;
  }
}
