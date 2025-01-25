import { DC } from "../../constants.js";

export const normalAchievements = [
  {
    id: 11,
    get description() { return $t("achievement_1x_tooltip", [Maker(1).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 12,
    get description() { return $t("achievement_1x_tooltip", [Maker(2).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 13,
    get description() { return $t("achievement_1x_tooltip", [Maker(3).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 14,
    get description() { return $t("achievement_1x_tooltip", [Maker(4).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 15,
    get description() { return $t("achievement_1x_tooltip", [Maker(5).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 16,
    get description() { return $t("achievement_1x_tooltip", [Maker(6).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 17,
    get description() { return $t("achievement_1x_tooltip", [Maker(7).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 18,
    get description() { return $t("achievement_1x_tooltip", [Maker(8).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 21,
    get description() { return $t("achievement_21_tooltip") },
    checkEvent: GAME_EVENT.BIG_RESET_BEFORE,
    checkRequirement: () => true,
    get reward() { return $t("achievement_21_reward") },
    effect: () => Currency.bigResetCount.value.pow(0.8).add(1),
    formatEffect: value => formatX(value, 2, 3),
    cap: DC.D50
  },
  {
    id: 22,
    get description() { return $t("achievement_22_tooltip") },
    checkEvent: GAME_EVENT.BIG_RESET_AFTER,
    checkRequirement: () => Collections.isFullUnlocked
  },
  {
    id: 23,
    get description() { return $t("achievement_23_tooltip") },
    checkEvent: GAME_EVENT.FIX_STEAMER_BEFORE,
    checkRequirement: () => true
  },
  {
    id: 24,
    get description() { return $t("achievement_24_tooltip", [formatInt(16)]) },
    checkEvent: GAME_EVENT.STEAMER_UPGRADE_BOUGHT,
    checkRequirement: () => Player.allSteamerUpgradesBought,
    get reward() { return $t("achievement_24_reward", [formatX(10)]) },
    effect: 10
  },
  {
    id: 25,
    displayId: 19,
    get description() { return $t("achievement_1x_tooltip", [Maker(9).name]) },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 26,
    get description() { return $t("achievement_26_tooltip", [format(DC.E2100)]) },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.jiaozi.gt(DC.E2100)
  },
  {
    id: 27,
    get description() { return $t("achievement_27_tooltip") },
    checkEvent: GAME_EVENT.NORMAL_CHALLENGE_COMPLETED,
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 1
  },
  {
    id: 28,
    get description() { return $t("achievement_28_tooltip") },
    checkEvent: GAME_EVENT.NORMAL_CHALLENGE_COMPLETED,
    checkRequirement: () => NormalChallenges.all.every(c => c.isCompleted) 
  },
  {
    id: 31,
    get description() { return $t("achievement_31_tooltip") },
    checkEvent: GAME_EVENT.FACTORY_UNLOCKED,
    checkRequirement: () => Factory(1).isUnlocked
  },
  {
    id: 32,
    get description() { return $t("achievement_32_tooltip") },
    checkEvent: GAME_EVENT.FACTORY_UNLOCKED,
    checkRequirement: () => Factory(4).isUnlocked
  },
  {
    id: 33,
    get description() { return $t("achievement_33_tooltip", [formatInt(1)]) },
    checkEvent: GAME_EVENT.COMPLETE_TASK,
    checkRequirement: () => Task.all.every(t => t.count >= 1)
  },
  {
    id: 34,
    get description() { return $t("achievement_34_tooltip") },
    checkEvent: GAME_EVENT.FACTORY_UNLOCKED,
    checkRequirement: () => Factory(8).isUnlocked
  },
  {
    id: 35,
    get description() { return $t("achievement_35_tooltip") },
    checkEvent: GAME_EVENT.CONCLUDE_SIMULATION_BEFORE,
    checkRequirement: () => true,
    get reward() { return $t("achievement_35_reward", [formatX(1.1, 0, 1)]) },
    effect: 1.1
  },
  {
    id: 36,
    get description() { return $t("achievement_36_tooltip", [format(DC.D9_99999E999, 5)]) },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.steamerCoins.gte(DC.E1000),
    get reward() { return $t("achievement_36_reward") },
    effect: () => Math.sqrt(Currency.steamerCoins.value.add(1).log10()) + 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 37,
    get description() { return $t("achievement_37_tooltip") },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 38,
    get description() { return $t("achievement_38_tooltip") },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  }
];
