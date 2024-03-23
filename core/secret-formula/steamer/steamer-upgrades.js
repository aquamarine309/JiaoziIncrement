import { DC } from "../../constants.js";

export const steamerUpgrades = {
  makerPow: {
    id: "makerPow",
    cost: 1,
    description: () => `所有制造器的效率${formatPow(1.2, 1, 1)}`,
    effect: 1.2,
    condition: () => !AdvancedSimulation.isRunning
  },
  steamerCountMult: {
    id: "countMult",
    cost: 2,
    description: "制造器获得基于蒸笼次数的加成",
    effect: () => player.steamerCount.pow(1.25).times(0.5).add(1).powEffectOf(NormalChallenge(4).reward),
    formatEffect: value => formatX(value, 2, 3),
    checkRequirement: () => SteamerUpgrade.makerPow.isBought
  },
  keepWrapper: {
    id: "keepWrapper",
    cost: 20,
    description: () => `每次收集重置后保留${formatPercents(0.5)}饺子皮`,
    effect: () => Math.floor(player.wrapper * 0.5),
  },
  scGen: {
    id: "scGen",
    cost: 4,
    description: "基于最快的蒸笼时间，你可以被动产生蒸笼币",
    effect: () => GameCache.totalSCMult.value,
    formatEffect: value => {
      if (player.records.bestSteamer.time >= 999999999999) return "本次模拟中你还没有蒸笼重置过"
      return `每${Time.bestSteamer.times(5).toStringShort()}产生${format(value, 2)}个蒸笼币`
    },
     checkRequirement: () => SteamerUpgrade.steamerCountMult.isBought
  },
  collectionsMult: {
    id: "colMult",
    cost: 1,
    description: () => `收集重置时获得的饺子${formatX(5)}`,
    effect: 5
  },
  commonPower: {
    id: "commonPower",
    cost: 3,
    description: () => `普通收集饺子的效果${formatPow(3)}`,
    effect: 3,
    checkRequirement: () => SteamerUpgrade.collectionsMult.isBought
  },
  keepStuffing: {
    id: "keepStuffing",
    cost: 50,
    description: "收集重置不再重置你的饺子馅",
    checkRequirement: () => SteamerUpgrade.keepWrapper.isBought
  },
  resetRequirement: {
    id: "resetReq",
    cost: 300,
    description: "你可以在未购买全部饺子馅时进行收集重置",
    checkRequirement: () => SteamerUpgrade.keepCollections.isBought
  },
  keepCollections: {
    id: "keepCollections",
    cost: 100,
    description: () => NormalChallenges.completed.length === 8 ? "修复蒸笼时不重置收集饺子" : `每次蒸笼重置后保留每种收集饺子各${format(NormalChallenge(1).reward.effectOrDefault(9) / 9, 2)}个`,
    checkRequirement: () => SteamerUpgrade.keepStuffing.isBought
  },
  scMult: {
    id: "scMult",
    cost: 10,
    description: "最快蒸笼重置时间加成蒸笼币",
    effect: () => Math.floor(Math.clamp(45 / Math.sqrt(Time.bestSteamer.totalSeconds), 1, 15)),
    cap: 15,
    formatEffect: value => formatX(value),
    checkRequirement: () => SteamerUpgrade.scGen.isBought
  },
  timeBoost: {
    id: "timeBoost",
    cost: 8,
    description: "剩余的蒸笼币加成制造器",
    effect: () => player.steamerCoins.pow(0.7).add(1),
    formatEffect: value => formatX(value, 2, 3),
    checkRequirement: () => SteamerUpgrade.commonPower.isBought
  },
  unlockSteamerAuto: {
    id: "unlockSteamerAuto",
    cost: 15,
    description: "解锁自动蒸笼重置",
    checkRequirement: () => SteamerUpgrade.timeBoost.isBought
  },
  nextMaker1: {
    id: "nextMaker1",
    cost: 20,
    description: "解锁下一级制造器"
  },
  nextMaker2: {
    id: "nextMaker2",
    cost: 50,
    description: "解锁下一级制造器",
    checkRequirement: () => SteamerUpgrade.nextMaker1.isBought
  },
  nextMaker3: {
    id: "nextMaker3",
    cost: 200,
    description: "解锁下一级制造器",
    checkRequirement: () => SteamerUpgrade.nextMaker2.isBought
  },
  nextMaker4: {
    id: "nextMaker4",
    cost: 1e3,
    description: "解锁下一级制造器",
    checkRequirement: () => SteamerUpgrade.nextMaker3.isBought
  },
  coinMult: {
    id: "coinMult",
    cost: () => SteamerUpgrade.coinMult.cost,
    checkRequirement: () => NormalChallenge(6).isCompleted,
    costCap: DC.E6E6,
    costIncreaseThreshold: DC.E3E6,
    description: () => `将所有来源的蒸笼币${formatX(2)}`,
    // Normally the multiplier caps at e993k or so with 3300000 purchases, but if the cost is capped then we just give
    // an extra e7k to make the multiplier look nice
    effect: () => (player.SCMultPurchases >= 3300000 ? DC.E1E6 : DC.D2.pow(player.SCMultPurchases)),
    cap: () => DC.E1E6,
    formatEffect: value => formatX(value, 2, 2),
  }
}