import { DC } from "./constants.js";
import { deepmergeAll } from '../deepmerge.js';
import { Languages } from "./languages.js";

window.player = {
  jiaozi: DC.E1,
  makers: Array.range(1, 9).map(() => {
    return {
      amount: DC.D0,
      bought: 0
    }
  }),
  factories: Array.range(1, 9).map(() => {
    return {
      amount: DC.D0,
      bought: 0,
      isUnlocked: false
    }
  }),
  maxResetJiaozi: DC.D0,
  money: DC.D0,
  break: false,
  makerCurrencyType: MAKER_CURRENCY.JIAOZI,
  version: 8.131,
  wrapper: 0,
  stuffing: 0,
  simulationStuffing: 0,
  collections: Array.repeat(0, 9),
  colActiveBits: 0,
  colAmplifiedBits: 0,
  amplificationPoints: 0,
  needResetCols: false,
  tutorialState: 0,
  partSteamerCoins: 0,
  SCMultPurchases: 0,
  postC7Tier: 0,
  secretUnlocks: {
    themes: new Set()
  },
  isSimulationAnimationActive: false,
  simulationAnimationState: 0,
  advancedSimulation: {
    isRunning: false,
    weakBits: 0
  },
  shownRuns: {
    bigReset: true,
    steamer: true
  },
  achievementBits: Array.repeat(0, 17),
  secretAchievementBits: Array.repeat(0, 4),
  requirementChecks: {
    simulation: {
      allRare: true
    }
  },
  records: {
    gameCreatedTime: Date.now(),
    fullGameCompletions: 0,
    totalTimePlayed: 0,
    realTimePlayed: 0,
    previousRunRealTime: 0,
    totalJiaozi: DC.E1,
    thisSale: {
      time: 0,
      realTime: 0
    },
    thisBigReset: {
      time: 0,
      realTime: 0,
      lastBuyTime: 0,
      maxJiaozi: DC.E1,
      maxMoney: DC.D0,
      bestColMin: 0,
      bestColMinValue: 0
    },
    
    thisSteamer: {
      time: 0,
      realTime: 0,
      lastBuyTime: 0,
      maxCols: 0,
      maxJiaozi: DC.E1,
      maxMoney: DC.D0,
      bestSCmin: DC.D0,
      bestSCminValue: DC.D0
    },
    thisSimulation: {
      time: 0,
      realTime: 0,
      lastBuyTime: 0,
      maxJiaozi: DC.E1,
      maxMoney: DC.D0,
      maxSC: DC.D0,
      bestCoresMin: DC.D0,
      bestCoresMinValue: DC.D0
    },
    bestBigReset: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE
    },
    bestSteamer: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE
    },
    bestSimulation: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE
    },
    recentBigReset: Array.range(0, 10).map(() => ({
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      currency: 0,
      count: DC.D0
    })),
    recentSteamer: Array.range(0, 10).map(() => ({
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      currency: DC.D0,
      count: DC.D0
    })),
    recentSimulation: Array.range(0, 10).map(() => ({
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      currency: DC.D0,
      count: DC.D0
    }))
  },
  totalColls: 0,
  steamerCoins: DC.D0,
  steamerCount: DC.D0,
  mixtures: DC.D0,
  tasks: {
    mixtures: 0,
    wrapper: 0,
    steamer: 0,
    collections: 0
  },
  simulation: {
    upgrades: {
      review: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0
      },
      previewBits: 0,
      unlockedBits: 0
    },
    spentEnergy: DC.D0,
    energy: DC.D0
  },
  cores: DC.D0,
  simulations: DC.D0,
  tabNotifications: new Set(),
  triggeredTabNotificationBits: 0,
  options: {
    theme: 'Normal',
    notation: "Scientific",
    language: Languages.base.name,
    updateCollectionSetAfterChallenge: true,
    notationDigits: {
      comma: 5,
      notation: 9
    },
    retryChallenge: false,
    showAllChallenges: false,
    updateRate: 33,
    offlineProgress: false,
    loadBackupWithoutOffline: false,
    automaticTabSwitching: true,
    respecIntoProtected: false,
    offlineTicks: 1e5,
    autosaveInterval: 30000,
    hibernationCatchup: true,
    statTabResources: 0,
    showTimeSinceSave: true,
    hideCompletedAchievementRows: false,
    saveFileName: "",
    exportedFileCount: 0,
    hiddenTabBits: 0,
    hiddenSubtabBits: Array.repeat(0, 11),
    lastOpenTab: 0,
    lastOpenSubtab: Array.repeat(0, 11),
    sidebarResourceID: 0,
    syncSaveIntervals: true,
    hotkeys: true,
    headerTextColored: false,
    showHintText: {
      showPercentage: true,
      achievements: true,
      achievementUnlockStates: true,
      challenges: true
    },
    animations: {
      concludeSimulation: true,
      steamer: true,
      background: false,
      blobSnowflakes: 16
    },
    confirmations: {
      steamer: true
    },
    awayProgress: {
      jiaozi: true,
      money: true,
      wrapper: true,
      stuffing: true,
      bigResetCount: true,
      steamerCoins: true,
      steamerCount: true,
      simulationCoins: true,
      simulations: true,
      energy: true
    },
    multiplierTab: {
      currTab: 0,
      showAltGroup: false,
      replacePowers: false,
    },
  },
  challenge: {
    normal: {
      current: 0,
      bestTimes: Array.repeat(Number.MAX_VALUE, 8),
      completedBits: 0,
      collectionSets: Array.repeat(0, 8)
    },
  },
  lastUpdate: Date.now(),
  initialSeed: Math.floor(Date.now() * Math.random() + 1),
  collectionPresets: [],
  backupTimer: 0,
  seed: 1,
  bigResetCount: DC.D0,
  steamerUpgrades: new Set(),
  auto: {
    autobuyersOn: true,
    makers: {
      all: Array.range(0, 9).map(tier => ({
        isUnlocked: false,
        cost: 1e80,
        interval: [500, 600, 700, 800, 1000, 5000, 10000, 15000, 18000][tier],
        bulk: 1,
        mode: AUTOBUYER_MODE.BUY_MAX,
        isActive: true,
        lastTick: 0,
        isBought: false
      })),
      isActive: false,
    },
    factories: {
      all: Array.range(0, 9).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    sale: {
      cost: 1e150,
      interval: 15000,
      mode: AUTO_SALE_MODE.AMOUNT,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false,
      lastTick: 0
    },
    bigReset: {
      cost: 1e250,
      interval: 15000,
      mode: AUTO_BIG_RESET_MODE.AMOUNT,
      amount: 1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false,
      lastTick: 0
    },
    steamer: {
      interval: 100,
      mode: AUTO_STEAMER_MODE.AMOUNT,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false,
      lastTick: 0
    },
    simulation: {
      interval: 100,
      mode: AUTO_SIMULATION_MODE.AMOUNT,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false,
      lastTick: 0
    },
    wrapper: {
      isUnlocked: false,
      cost: 1e150,
      interval: 1500,
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: false,
      lastTick: 0,
      isBought: false
    },
    stuffing: {
      isUnlocked: false,
      cost: 1e150,
      interval: 1500,
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: false,
      lastTick: 0,
      isBought: false
    },
    scMultBuyer: { isActive: false },
    tasks: {
      all: Array.range(0, 4).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: false
    }
  }
}

export const Player = {
  defaultStart: deepmergeAll([{}, player]),
  
  get steamerGoal() {
    const challenge = this.normalChallenge
    return challenge === undefined ? Decimal.NUMBER_MAX_VALUE : challenge.goal;
  },
  
  get canFixSteamer() {
    return player.records.thisSteamer.maxJiaozi.gte(this.steamerGoal);
  },
  
  get allSteamerUpgradesBought() {
    return player.steamerUpgrades.size >= 16;
  },
  
  get isInNormalChallenge() {
    return player.challenge.normal.current !== 0;
  },
  
  get normalChallenge() {
    return NormalChallenge.current;
  },
  
  get isInAnyChallenge() {
    return this.isInNormalChallenge;
  },
  
  get anyChallenge() {
    return this.normalChallenge;
  },
  
  get steamerLimit() {
    const challenge = this.normalChallenge
    return challenge === undefined ? Decimal.MAX_VALUE : challenge.goal;
  },
  
  get concludeGoal() {
    return DC.E500;
  },
  
  get canConclude() {
    return player.records.thisSimulation.maxSC.gte(this.concludeGoal);
  },
  
  get makerMultDecrease() {
    return GameCache.makerMultDecrease.value;
  }
}


export function guardFromNaNValues(obj) {
  function isObject(ob) {
    return ob !== null && typeof ob === "object" && !(ob instanceof Decimal);
  }

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    let value = obj[key];
    if (isObject(value)) {
      guardFromNaNValues(value);
      continue;
    }

    if (typeof value === "number") {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new Error("null/undefined player property assignment");
          }
          if (typeof newValue !== "number") {
            throw new Error("Non-Number assignment to Number player property");
          }
          if (!isFinite(newValue)) {
            throw new Error("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }

    if (value instanceof Decimal) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new Error("null/undefined player property assignment");
          }
          if (!(newValue instanceof Decimal)) {
            throw new Error("Non-Decimal assignment to Decimal player property");
          }
          if (!isFinite(newValue.mantissa) || !isFinite(newValue.exponent)) {
            throw new Error("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }
  }
}
