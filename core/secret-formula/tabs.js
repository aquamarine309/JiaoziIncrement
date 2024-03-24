export const tabs = [
  {
    key: "main",
    name: 'production',
    id: 0,
    hidable: true,
    subtabs: [
      {
        key: "maker",
        name: 'jMakers',
        id: 0,
        symbol: "<i class='fas fa-gears'></i>",
        hidable: true,
        component: 'JiaoziMakersTab'
      },
      {
        key: "factory",
        name: "mFactories",
        id: 1,
        symbol: "<i class='fa fa-cube'></i>",
        hidable: true,
        component: "FactoriesTab",
        condition: () => PlayerProgress.factoriesUnlocked()
      }
    ]
  },
  {
    key: 'collections',
    name: 'coll',
    id: 1,
    hidable: true,
    UIClass: "o-tab-btn--collections",
    condition: () => PlayerProgress.collectionUnlocked(),
    subtabs: [
      {
        key: 'collections',
        name: 'collections',
        id: 0,
        symbol: "<i class='fas fa-paper-plane'></i>",
        hidable: true,
        component: 'CollectionsTab'
      }
    ]
  },
  {
    key: "options",
    name: "options",
    id: 2,
    hidable: false,
    subtabs: [
      {
        key: "saving",
        name: "saving",
        id: 0,
        symbol: "<i class='fas fa-save'></i>",
        hidable: false,
        component: "OptionsSavingTab"
      },
      {
        key: "visual",
        name: "visual",
        symbol: "<i class='fas fa-palette'></i>",
        component: "OptionsVisualTab",
        id: 1,
        hidable: false,
      },
      {
        key: "gameplay",
        name: "gameplay",
        symbol: "<i class='fas fa-wrench'></i>",
        component: "OptionsGameplayTab",
        id: 2,
        hidable: false,
      }
    ]
  },
  {
    key: "challenges",
    name: "challenges",
    id: 3,
    hidable: true,
    condition: () => PlayerProgress.hasBroken(),
    subtabs: [
      {
        key: "normal",
        name: "ncs",
        id: 0,
        component: "NormalChallengesTab",
        hidable: true,
        symbol: "<i class='fas fa-gears'></i>"
      }
    ]
  },
  {
    key: "automation",
    name: "automation",
    id: 4,
    hidable: true,
    subtabs: [
      {
        key: "autobuyers",
        name: "autobuyers",
        symbol: "<i class='fas fa-cog'></i>",
        component: "AutobuyersTab",
        id: 0,
        hidable: true,
      }
    ]
  },
  {
    key: "steamer",
    name: "steamer",
    id: 5,
    condition: () => PlayerProgress.steamerUnlocked(),
    hidable: true,
    UIClass: "o-tab-btn--steamer",
    subtabs: [
      {
        key: "upgrades",
        name: "sus",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "SteamerUpgradesTab",
        id: 0,
        hidable: true,
      },
      {
        key: "tasks",
        name: "tasks",
        symbol: "<i class='fas fa-tasks'>",
        component: "TasksTab",
        id: 1,
        hidable: true,
        condition: () => PlayerProgress.tasksUnlocked()
      }
    ]
  },
  {
    key: "statistics",
    name: "statistics",
    hideAt: 1.7,
    id: 5,
    hidable: true,
    subtabs: [
      {
        key: "statistics",
        name: "statistics",
        symbol: "<i class='fas fa-clipboard-list'></i>",
        component: "StatisticsTab",
        id: 0,
        hidable: true,
      }
    ]
  },
  {
    key: "achievements",
    name: "achievements",
    id: 6,
    hidable: true,
    subtabs: [
      {
        key: "normal",
        name: "normalAchs",
        symbol: "<i class='fas fa-trophy'></i>",
        component: "NormalAchievementsTab",
        id: 0,
        hidable: true,
      },
      {
        key: "secret",
        name: "secretAchs",
        symbol: "<i class='fas fa-question'></i>",
        component: "SecretAchievementTab",
        id: 1,
        hidable: true,
        condition: () => false
      }
    ]
  },
  {
    key: "simulation",
    name: "simulation",
    id: 7,
    hidable: true,
    UIClass: "o-tab-btn--simulation",
    condition: () => PlayerProgress.simulationUnlocked(),
    subtabs: [
      {
        key: "branches",
        name: "branches",
        symbol: "<i class='fas fa-tree'></i>",
        component: "BranchesTab",
        id: 0,
        hidable: true
      },
      {
        key: "milestones",
        name: "simulationMilestones",
        symbol: "<i class='fas fa-star'></i>",
        component: "SimulationMilestonesTab",
        id: 1,
        hidable: true
      },
      {
        key: "upgrades",
        name: "simUpgs",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "SimulationUpgradesTab",
        id: 2,
        hidable: true,
        condition: () => SimulationMilestone.upgrades.isReached
      }
    ]
  }
]