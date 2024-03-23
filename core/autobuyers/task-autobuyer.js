import { IntervaledAutobuyerState } from "./autobuyer.js";

export class TaskAutobuyerState extends IntervaledAutobuyerState {
  get _upgradeName() { return ["mixtures", "wrapper", "steamer", "collections"][this.id - 1] }

  get name() {
    return `${$t("task")} ${formatInt(this.id)}`;
  }

  get data() {
    return player.auto.tasks.all[this.id - 1];
  }

  get interval() {
    return 1000;
  }

  get isUnlocked() {
    return SimulationMilestone.qols.isReached;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.SIMULATION;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    super.tick();
    Task[this._upgradeName].complete();
  }

  static get entryCount() { return 4; }
  static get autobuyerGroupName() { return $t("task"); }
  static get isActive() { return player.auto.tasks.isActive; }
  static set isActive(value) { player.auto.tasks.isActive = value; }
}
