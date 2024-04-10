import { DC } from "./constants.js";

export function manualConcludeSimulationRequest() {
  if (!Player.canConclude) return;
  concludeSimulationRequest();
}

export function concludeSimulationRequest(animation = true) {
  if (!Player.canConclude) return;
  if (!PlayerProgress.simulationUnlocked() && animation) {
    SimulationAnimation.start();
  } else {
    concludeSimulationReset(false);
  }
}

export function concludeSimulationReset(force = false) {
  if (!Player.canConclude && !force) return false;
  EventHub.dispatch(GAME_EVENT.CONCLUDE_SIMULATION_BEFORE);
  if (Player.canConclude) giveSimulationRewards();
  simulationResetValues();
  SimulationAnimation.reverse();
  EventHub.dispatch(GAME_EVENT.CONCLUDE_SIMULATION_AFTER);
}

export function totalCoresMult() {
  let multiplier = DC.D1;
  multiplier = multiplier.timesEffectOf(SimulationRebuyable.coreBoost);
  return multiplier;
}

export function gainedCores() {
  const sc = Currency.steamerCoins.value.add(gainedSteamerCoins());
  
  let cores = Decimal.pow(5, sc.log10() / 500 - 0.609324);
  cores = cores.times(GameCache.totalCoresMult.value);
  return cores.floor();
}

export function gainedSimulations() {
  return DC.D1;
}

function simulationTabChange(first) {
  if (first) Tab.simulation.milestones.show();
}

function giveSimulationRewards() {
  Currency.cores.add(gainedCores());
  simulationTabChange(!PlayerProgress.simulationUnlocked());
   player.records.bestSimulation.time =
   Math.min(player.records.bestSimulation.time, player.records.thisSimulation.time);
   player.records.bestSimulation.realTime =
   Math.min(player.records.bestSteamer.realTime, player.records.thisSimulation.realTime);
   Currency.simulations.add(gainedSimulations());
}

function simulationResetValues() {
  simulationUpdateStatistics()
  
  Currency.jiaozi.reset();
  Currency.money.reset();
  Makers.reset();
  Factories.resetAmount();
  Factories.fullReset();
  Currency.mixtures.reset();
  Currency.steamerCoins.reset();
  resetTasks();
  if (SimulationMilestone.qols2.isReached) {
    player.tasks.collections = 1;
  }
  Collections.fullReset();
  if (!SimulationMilestone.qols.isReached) {
    player.steamerUpgrades = new Set();
    player.break = false;
    Autobuyers.reset();
  };
  if (!SimulationMilestone.keepChall.isReached) {
    player.challenge.normal.completedBits = 0;
  }
  Wrapper.amount = 0;
  Stuffing.amount = 0;
  player.partSteamerCoins = 0;
  player.SCMultPurchases = 0;
  Currency.bigResetCount.reset();
  Currency.steamerCount.reset();
}

function simulationUpdateStatistics() {
  player.records.bestBigReset.time = 999999999999;
  player.records.bestBigReset.realTime = 999999999999;
  player.records.thisSimulation.bestCoresMin = DC.D0;
  player.records.thisSimulation.bestCoresMinValue = DC.D0;
  player.records.thisSteamer.bestSCmin = DC.D0;
  player.records.thisSteamer.bestSCminValue = DC.D0;
  player.records.thisBigReset.bestColMin = 0;
  player.records.thisBigReset.bestColMinValue = 0;
  player.records.bestSteamer.time = 999999999999;
  player.records.bestSteamer.realTime = 999999999999;
  player.records.thisSimulation.maxJiaozi = DC.E1;
  player.records.thisSimulation.maxMoney = DC.D0;
  player.records.thisSimulation.maxSC = DC.D0;
  player.records.thisSimulation.time = 0;
  player.records.thisSimulation.realTime = 0;
  player.records.thisSteamer.maxJiaozi = DC.E1;
  player.records.thisSteamer.maxMoney = DC.D0;
  player.records.thisSteamer.maxCols = 0;
  player.records.thisSteamer.time = 0;
  player.records.thisSteamer.realTime = 0;
  player.records.thisBigReset.time = 0;
  player.records.thisBigReset.realTime = 0;
  player.records.thisSale.time = 0;
  player.records.thisSale.realTime = 0;
  player.records.thisBigReset.maxJiaozi = DC.E1;
  player.records.thisBigReset.maxMoney = DC.D0;
  player.maxResetJiaozi = DC.D0;
  resetChallengeStuff();
  resetCollectionsSelect();
  GameCache.makerMultDecrease.invalidate();
  GameCache.energyConversionEfficiency.invalidate();
}
