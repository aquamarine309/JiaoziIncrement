export const AdvancedSimulation = {
  get isRunning() {
    return player.advancedSimulation.isRunning;
  },
  
  set isRunning(value) {
    player.advancedSimulation.isRunning = value;
  }
}