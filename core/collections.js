import { GameMechanicState } from "./game-mechanics/index.js";
import { deepmergeAll } from "../deepmerge.js";

class CollectionState extends GameMechanicState {
    constructor(config) {
    const configCopy = deepmergeAll([{}, config]);
    const effectFn = config.effectFn;
    configCopy.effect = () => effectFn(this.totalAmount);
    configCopy.name = () => Theme.currentName().isInverted ? $t(`I_${config.key}_`) : $t(`_${config.key}_`);
    if (configCopy.cappedAmount) configCopy.cap = () => config.effectFn(this.cappedAmount);
    super(configCopy);
  }
  
  get cappedAmount() {
    if (typeof this.config.cappedAmount === "function") return this.config.cappedAmount();
    return this.config.cappedAmount;
  }
  
  get url() {
    return `./images/collections/${this.key}.png`;
  }
  
  get name() {
    return this.config.name();
  }
  
  get key() {
    return this.config.key;
  }
  
  get isUnlocked() {
    return this.amount > 0 || PlayerProgress.steamerUnlocked();
  }
  
  get amount() {
    return player.break ? player.totalColls / 9 : player.collections[this.id];
  }
  
  get totalAmount() {
    return this.amount + Collections.extraAmount / 9;
  }
  
  set amount(value) {
    player.collections[this.id] = value;
  }
  
  add(value = 1) {
    this.amount += value;
  }
  
  get isActive() {
    return (player.colActiveBits & (1 << this.id)) !== 0;
  }
  
  get canActivate() {
    if (this.isActive) return false;
    if (!this.isUnlocked) return false;
    if (this.totalAmount <= 0) return false;
    if (NormalChallenge(5).isRunning && this.id >= 6 && this.id <= 8) return false;
    if (Collections.activeAmount >= Collections.maxActiveAmount) return false;
    return true;
  }
  
  get amplificationPoints() {
    return this.config.amplificationPoints;
  }
  
  get isAmplified() {
    return (player.colAmplifiedBits & (1 << this.id)) !== 0;
  }
  
  get canAmplify() {
    if (this.isAmplified) return false;
    if (Collections.isAmplifyUnlocked) return false;
    if (Currency.amplificationPoints.lt(this.amplificationPoints)) return;
    if (this.isUnlocked) return false;
    if (this.totalAmount <= 0) return false;
    return true;
  }
  
  activate() {
    if (!this.canActivate) return;
    Tutorial.turnOffEffect(TUTORIAL_STATE.COLLECTION);
    if (this.rarity !== COLLEACTION_RARITY.RARE) {
      player.requirementChecks.simulation.allRare = false;
    }
    player.colActiveBits |= (1 << this.id);
  }
  
  amplify() {
    if (!this.canAmplify) return;
    player.colAmplifiedBits |= (1 << this.id);
  }
  
  get rarity() {
    return this.config.rarity;
  }
  
  get rarityName() {
    return $t(this.rarity);
  }
  
  get isEffectActive() {
    return this.isUnlocked && this.isActive;
  }
}

export const Collection = mapGameData(
  GameDatabase.collections,
  config => new CollectionState(config)
);

export const Collections = {
  /**@type {CollectionState[]} */
  all: Collection,
  
  get isFullUnlocked() {
    return PlayerProgress.steamerUnlocked() || this.all.every(c => c.isUnlocked);
  },
  
  get activeAmount() {
    return this.all.countWhere(c => c.isActive);
  },
  
  get maxActiveAmount() {
    if (NormalChallenge(4).isRunning) return 0;
    if (NormalChallenge(7).isRunning) return 1;
    
    let amount = 3;
    if (NormalChallenge(2).isCompleted) amount++
    amount += Task.collections.reward.effectOrDefault(0);
    return amount;
  },
  
  get isAmplificationUnlocked() {
    return SimulationUpgrade.unlockAmplifiedCollection.isBought;
  },
  
  get amplificationPointsLeft() {
    return Currency.amplificationPoints.value - this.all.filter(c => c.isAmplified).map(c => c.amplificationPoints).sum();
  },
  
  fullReset() {
    this.all.forEach(v => v.amount = 0);
    player.totalColls = 0;
  },
  
  get extraAmount() {
    return SimulationMilestone.weakGainedColls.effectOrDefault(0);
  },
  
  common: [],
  
  uncommon: [],
  
  rare: [],
  
  epic: [],
  
  legendary: []
};

(function() {
  for (const col of Collections.all) {
    Collections[col.rarity].push(col);
    Collections[col.key] = col;
  }
})();

export function random() {
  const state = xorshift32Update(player.seed);
  player.seed = state;
  return state * 2.3283064365386963e-10 + 0.5;
}

/**
 * @param {object} options
 * @param {number} options.common
 * @param {number} options.uncommon
 * @param {number} options.rare
 * @param {number} options.epic
 * @param {number} options.legendary
 * @param {number} options.bulk
 */
export function collectionGenerator(options) {
  if (Player.isInNormalChallenge) return;
  const bulk = options.bulk;
  delete options.bulk;
  
  player.totalColls += bulk;
  if (player.break) return;
  
  let total = 0;
  for (const key in options) {
    total += options[key] * Collections[key].length;
  };
  
  if (bulk > 10) {
    for (const key in options) {
      const cols = Collections[key];
      for (const col of cols) {
        col.add(bulk * options[key] * cols.length / total);
      }
    };
    return;
  }
  
  let times = 0;
  while (times < bulk) {
    const uniform = random();
    let current = 0;
    for (const key in options) {
      const cols = Collections[key];
      if (
        uniform > current && 
        uniform < (current + options[key] * cols.length / total)
      ) {
        const uniform2 = random();
        cols[Math.floor(cols.length * uniform2)].add(1);
        ++times;
        break;
      }
      current += options[key] * cols.length / total;
    }
  }
}

export function resetCollectionsSelect() {
  player.colActiveBits = 0;
  player.needResetCols = false;
}