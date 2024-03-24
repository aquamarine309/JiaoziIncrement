import { IntervaledAutobuyerState } from "./autobuyer.js";

export class FactoryAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get factory() {
    return Factory(this.tier);
  }

  get name() {
    return this.factory.displayName;
  }

  get fullName() {
    return this.name;
  }

  get data() {
    return player.auto.factories.all[this.tier - 1];
  }

  get interval() {
    return 1000;
  }

  get isUnlocked() {
    return SimulationMilestone.autoFactory.isReached;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.SIMULATION;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  get canTick() {
    return Factories.canAutobuy() && this.factory.isAvailableForPurchase && super.canTick;
  }

  tick() {
    super.tick();
    this.factory.buyMax(true);
  }

  static get entryCount() { return 9; }
  static get autobuyerGroupName() { return $t("factory"); }
  static get isActive() { return player.auto.factories.isActive; }
  static set isActive(value) { player.auto.factories.isActive = value; }
}
