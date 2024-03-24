export const awayProgressTypes = [
  {
    name: "jiaozi",
    isUnlocked: () => true,
    reference: ["jiaozi"],
    awayOption: "jiaozi"
  }, {
    name: "money",
    isUnlocked: () => true,
    reference: ["money"],
    awayOption: "money"
  }, {
    name: "wrapper",
    isUnlocked: () => true,
    reference: ["wrapper"],
    awayOption: "wrapper"
  }, {
    name: "stuffing",
    isUnlocked: () => true,
    reference: ["stuffing"],
    awayOption: "stuffing"
  }, {
    name: "_bigResetCount",
    isUnlocked: () => PlayerProgress.collectionUnlocked(),
    reference: ["bigResetCount"],
    awayOption: "bigResetCount"
  }, {
    name: "collection",
    isUnlocked: () => PlayerProgress.collectionUnlocked(),
    reference: ["totalColls"],
    awayOption: "collection"
  }, {
    name: "sc",
    reference: ["steamerCoins"],
    isUnlocked: () => PlayerProgress.steamerUnlocked(),
    awayOption: "steamerCoins"
  }, {
    name: "_steamerCount",
    reference: ["steamerCount"],
    isUnlocked: () => PlayerProgress.steamerUnlocked(),
    awayOption: "steamerCount"
  }, {
    name: "core",
    reference: ["cores"],
    isUnlocked: () => PlayerProgress.simulationUnlocked(),
    awayOption: "core"
  }, {
    name: "simulations",
    reference: ["simulations"],
    isUnlocked: () => PlayerProgress.simulationUnlocked(),
    awayOption: "simulations"
  },
  {
    name: "energy",
    reference: ["simulation", "energy"],
    isUnlocked: () => SimulationMilestone.upgrades.isReached,
    awayOption: "energy"
  }
];
