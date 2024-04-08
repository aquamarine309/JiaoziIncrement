import { GameMechanicState } from "./game-mechanics/index.js";

class SimulationMilestoneState extends GameMechanicState {
  get cores() {
    return this.config.cores;
  }
  
  get isReached() {
    return this.isUnlocked && Currency.cores.gte(this.cores);
  }
  
  get isEffectActive() {
    return this.isReached;
  }
  
  get isUnlocked() {
    if (this.id <= 10) return true;
    return SimulationUpgrade.moreMilestone.isBought;
  }
}

export const SimulationMilestone = mapGameDataToObject(
  GameDatabase.simulation.milestones,
  config => new SimulationMilestoneState(config)
)