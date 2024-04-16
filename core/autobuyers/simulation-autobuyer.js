import { AutobuyerState } from "./autobuyer.js";

export class SimulationAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.simulation;
  }

  get name() {
    return $t("simulation");
  }

  maxIntervalForFree() {}
  
  get isUnlocked() {
    return SimulationMilestone.qols2.isReached;
  }

  get baseInterval() {
    return Player.defaultStart.auto.simulation.interval;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasAdditionalModes() {
    return false;
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
    return null;
  }

  get highestPrevPrestige() {
    return player.records.thisSimulation.maxSC;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisSimulationRealTime.totalSeconds, 0);
  }

  get willReset() {
    switch (this.mode) {
      case AUTO_SIMULATION_MODE.AMOUNT:
        return gainedCores().gte(this.amount);
      case AUTO_SIMULATION_MODE.TIME:
        return Time.thisSimulationRealTime.totalSeconds > this.time;
      case AUTO_SIMULATION_MODE.X_HIGHEST:
      default:
        return gainedSteamerCoins().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    if (this.willReset) concludeSimulationRequest();
  }

  reset() {
    super.reset();
    this.mode = AUTO_SIMULATION_MODE.AMOUNT;
  }
}
