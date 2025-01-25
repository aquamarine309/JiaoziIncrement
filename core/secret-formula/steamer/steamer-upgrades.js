import { DC } from "../../constants.js";

export const steamerUpgrades = {
  makerPow: {
    id: "makerPow",
    cost: 1,
    description: () => $t("steamer_upgrade_makerPow", [formatPow(1.2, 1, 1)]),
    effect: 1.2
  },
  steamerCountMult: {
    id: "countMult",
    cost: 2,
    description: () => $t("steamer_upgrade_steamerCountMult"),
    effect: () => player.steamerCount.pow(1.25).times(0.5).add(1).powEffectOf(NormalChallenge(4).reward),
    formatEffect: value => formatX(value, 2, 3),
    checkRequirement: () => SteamerUpgrade.makerPow.isBought
  },
  keepWrapper: {
    id: "keepWrapper",
    cost: 20,
    description: () => $t("steamer_upgrade_keepWrapper", [formatPercents(0.5)]),
    effect: () => Math.floor(player.wrapper * 0.5),
  },
  scGen: {
    id: "scGen",
    cost: 4,
    description: () => $t("steamer_upgrade_scGen"),
    effect: () => GameCache.totalSCMult.value,
    formatEffect: value => {
      //"noFastestSteamerReset" is from Statisfic Tab.
      if (player.records.bestSteamer.time >= 999999999999) return $t("noFastestSteamerReset");
      return $t("steamer_upgrade_scGen_effect", [Time.bestSteamer.times(5).toStringShort(), format(value, 2)]);
    },
     checkRequirement: () => SteamerUpgrade.steamerCountMult.isBought
  },
  collectionsMult: {
    id: "colMult",
    cost: 1,
    description: () => $t("steamer_upgrade_collectionsMult", [formatX(5)]),
    effect: 5
  },
  commonPower: {
    id: "commonPower",
    cost: 3,
    description: () => $t("steamer_upgrade_commonPower", [formatPow(3)]),
    effect: 3,
    checkRequirement: () => SteamerUpgrade.collectionsMult.isBought
  },
  keepStuffing: {
    id: "keepStuffing",
    cost: 50,
    description: () => $t("steamer_upgrade_keepStuffing"),
    checkRequirement: () => SteamerUpgrade.keepWrapper.isBought
  },
  resetRequirement: {
    id: "resetReq",
    cost: 300,
    description: () => $t("steamer_upgrade_resetRequirement"),
    checkRequirement: () => SteamerUpgrade.keepCollections.isBought
  },
  keepCollections: {
    id: "keepCollections",
    cost: 100,
    description: () => NormalChallenges.completed.length === 8 ? $t("steamer_upgrade_keepCollections_all") : $t("steamer_upgrade_keepCollections", [format(NormalChallenge(1).reward.effectOrDefault(9) / 9, 2)]),
    checkRequirement: () => SteamerUpgrade.keepStuffing.isBought
  },
  scMult: {
    id: "scMult",
    cost: 10,
    description: () => $t("steamer_upgrade_scMult"),
    effect: () => Math.floor(Math.clamp(45 / Math.sqrt(Time.bestSteamer.totalSeconds), 1, 15)),
    cap: 15,
    formatEffect: value => formatX(value),
    checkRequirement: () => SteamerUpgrade.scGen.isBought
  },
  timeBoost: {
    id: "timeBoost",
    cost: 8,
    description: () => $t("steamer_upgrade_timeBoost"),
    effect: () => player.steamerCoins.pow(0.7).add(1),
    formatEffect: value => formatX(value, 2, 3),
    checkRequirement: () => SteamerUpgrade.commonPower.isBought
  },
  unlockSteamerAuto: {
    id: "unlockSteamerAuto",
    cost: 15,
    description: () => $t("steamer_upgrade_unlockSteamerAuto"),
    checkRequirement: () => SteamerUpgrade.timeBoost.isBought
  },
  nextMaker1: {
    id: "nextMaker1",
    cost: 20,
    description: () => $t("steamer_upgrade_nextMaker", [format(1)])
  },
  nextMaker2: {
    id: "nextMaker2",
    cost: 50,
    description: () => $t("steamer_upgrade_nextMaker", [format(1)]),
    checkRequirement: () => SteamerUpgrade.nextMaker1.isBought
  },
  nextMaker3: {
    id: "nextMaker3",
    cost: 200,
    description: () => $t("steamer_upgrade_nextMaker", [format(1)]),
    checkRequirement: () => SteamerUpgrade.nextMaker2.isBought
  },
  nextMaker4: {
    id: "nextMaker4",
    cost: 1e3,
    description: () => $t("steamer_upgrade_nextMaker", [format(1)]),
    checkRequirement: () => SteamerUpgrade.nextMaker3.isBought
  },
  coinMult: {
    id: "coinMult",
    cost: () => SteamerUpgrade.coinMult.cost,
    checkRequirement: () => NormalChallenge(6).isCompleted,
    costCap: DC.E6E6,
    costIncreaseThreshold: DC.E3E6,
    description: () => $t("steamer_upgrade_coinMult", [formatX(2)]),
    // Normally the multiplier caps at e993k or so with 3300000 purchases, but if the cost is capped then we just give
    // an extra e7k to make the multiplier look nice
    effect: () => (player.SCMultPurchases >= 3300000 ? DC.E1E6 : DC.D2.pow(player.SCMultPurchases)),
    cap: () => DC.E1E6,
    formatEffect: value => formatX(value, 2, 2),
  }
}