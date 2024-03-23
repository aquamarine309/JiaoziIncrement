import { DC } from "../../constants.js";

export const normalAchievements = [
  {
    id: 11,
    get description() { return  `${$t("buyOne")}${Maker(1).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 12,
    get description() { return `${$t("buyOne")}${Maker(2).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 13,
    get description() { return `${$t("buyOne")}${Maker(3).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 14,
    get description() { return `${$t("buyOne")}${Maker(4).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 15,
    get description() { return `${$t("buyOne")}${Maker(5).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 16,
    get description() { return `${$t("buyOne")}${Maker(6).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 17,
    get description() { return `${$t("buyOne")}${Maker(7).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 18,
    get description() { return `${$t("buyOne")}${Maker(8).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 21,
    get description() { return $t("ach21_d") },
    checkEvent: GAME_EVENT.BIG_RESET_BEFORE,
    checkRequirement: () => true,
    get reward() { return $t("ach21_r") },
    effect: () => Currency.bigResetCount.value.pow(0.8).add(1),
    formatEffect: value => formatX(value, 2, 3),
    cap: DC.D50
  },
  {
    id: 22,
    get description() { return $t("ach22_d") },
    checkEvent: GAME_EVENT.BIG_RESET_BEFORE,
    checkRequirement: () => Collections.isFullUnlocked
  },
  {
    id: 23,
    get description() { return $t("ach23_d") },
    checkEvent: GAME_EVENT.FIX_STEAMER_BEFORE,
    checkRequirement: () => true
  },
  {
    id: 24,
    get description() { return $t("ach24_d", [formatInt(16)]) },
    checkEvent: GAME_EVENT.STEAMER_UPGRADE_BOUGHT,
    checkRequirement: () => Player.allSteamerUpgradesBought,
    get reward() { return $t("ach24_r", [formatX(10)]) },
    effect: 10
  },
  {
    id: 25,
    displayId: 19,
    get description() { return `${$t("buyOne")}${Maker(9).name}${$t("stop")}` },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 26,
    get description() { return $t("ach26_d", [format(DC.E2100)]) },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.jiaozi.gt(DC.E2100)
  },
  {
    id: 27,
    get description() { return $t("ach27_d") },
    checkEvent: GAME_EVENT.NORMAL_CHALLENGE_COMPLETED,
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 1
  },
  {
    id: 28,
    get description() { return $t("ach28_d") },
    checkEvent: GAME_EVENT.NORMAL_CHALLENGE_COMPLETED,
    checkRequirement: () => NormalChallenges.all.every(c => c.isCompleted) 
  },
  {
    id: 31,
    get description() { return $t("ach31_d") },
    checkEvent: GAME_EVENT.FACTORY_UNLOCKED,
    checkRequirement: () => Factory(1).isUnlocked
  },
  {
    id: 32,
    get description() { return $t("ach32_d") },
    checkEvent: GAME_EVENT.FACTORY_UNLOCKED,
    checkRequirement: () => Factory(4).isUnlocked
  },
  {
    id: 33,
    get description() { return $t("ach33_d", [formatInt(1)]) },
    checkEvent: GAME_EVENT.COMPLETE_TASK,
    checkRequirement: () => Task.all.every(t => t.count >= 1)
  },
  {
    id: 34,
    get description() { return $t("ach34_d") },
    checkEvent: GAME_EVENT.FACTORY_UNLOCKED,
    checkRequirement: () => Factory(8).isUnlocked
  },
  {
    id: 35,
    get description() { return $t("ach35_d") },
    checkEvent: GAME_EVENT.CONCLUDE_SIMULATION_BEFORE,
    checkRequirement: () => true,
    get reward() { return $t("ach35_r", [formatX(1.1, 0, 1)]) },
    effect: 1.1
  },
  {
    id: 36,
    get description() { return $t("ach36_d", [format(DC.D9_99999E999, 5)]) },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.steamerCoins.gte(DC.E1000)
  },
  {
    id: 37,
    get description() { return $t("ach37_d") },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 38,
    get description() { return $t("ach38_d") },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  }
];
