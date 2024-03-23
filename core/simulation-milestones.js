import { GameMechanicState } from "./game-mechanics/index.js";

class SimulationMilestoneState extends GameMechanicState {
  get cores() {
    return this.config.cores;
  }
  
  get isReached() {
    return Currency.cores.gte(this.cores);
  }
  
  get isEffectActive() {
    return this.isReached;
  }
}

export const SimulationMilestone = mapGameDataToObject(
  GameDatabase.simulation.milestones,
  config => new SimulationMilestoneState(config)
)