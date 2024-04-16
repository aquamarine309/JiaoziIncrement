export const secretAchievements = [
  {
    id: 11,
    description: () => $t("sa11_d"),
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 12,
    description: () => $t("sa12_d"),
    checkEvent: GAME_EVENT.CONCLUDE_SIMULATION_BEFORE,
    checkRequirement: () => player.requirementChecks.simulation.allRare
  },
  {
    id: 13,
    description: () => $t("sa13_d"),
    checkEvent: GAME_EVENT.NORMAL_CHALLENGE_START,
    checkRequirement: id => (
      id === 3 && 
      !player.auto.autobuyersOn && 
      Autobuyers.unlocked.every(a => !a.isActive)
    )
  },
  {
    id: 14,
    description: () => $t("placeholder"),
    isPlaceholder: true,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 15,
    description: () => $t("placeholder"),
    isPlaceholder: true,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 16,
    description: () => $t("placeholder"),
    isPlaceholder: true,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 17,
    description: () => $t("placeholder"),
    isPlaceholder: true,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  },
  {
    id: 18,
    description: () => $t("placeholder"),
    isPlaceholder: true,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER
  }
];
