import { AutobuyerState } from "./autobuyer.js";

export class SCMultAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.scMultBuyer;
  }

  get name() {
    return $t("scMultiplier");
  }

  get isUnlocked() {
    return SimulationMilestone.qols.isReached;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    SteamerUpgrade.coinMult.buyMax();
  }
}