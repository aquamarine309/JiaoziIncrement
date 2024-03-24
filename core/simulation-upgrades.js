import { DC } from "./constants.js";

export function totalEnergyMult() {
  return DC.D1;
}

export function energyPerSecond() {
  return Currency.cores.value.times(GameCache.totalEnergyMult.value);
}