import { GameMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js"

class NormalChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get isEffectActive() {
    return this._challenge.isCompleted;
  }
}


class NormalChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new NormalChallengeRewardState(config.reward, this);
  }

  get isUnlocked() {
    return player.records.totalJiaozi.gte(NormalChallenges.requirement);
  }

  get isRunning() {
    return player.challenge.normal.current === this.id;
  }

  requestStart() {
    if (!player.options.confirmations.challenges) {
      this.start();
      return;
    }
    Modal.startNormalChallenge.show(this.id);
  }
  
  get activeBits() {
    return player.challenge.normal.collectionSets[this.id];
  }
  
  set activeBits(value) {
    player.challenge.normal.collectionSets[this.id] = value;
  }

  start() {
    if (this.isRunning) return;
    steamerChall();
    player.challenge.normal.current = this.id;
    EventHub.logic.dispatch(GAME_EVENT.NORMAL_CHALLENGE_START, this.id);
    if (this.id === 3) {
      player.auto.autobuyersOn = true;
      player.auto.wrapper.isActive = true;
      player.auto.wrapper.mode = AUTOBUYER_MODE.BUY_MAX;
    }
    if (this.id === 4 || (this.id === 5 && Collections.all.some(v => v.id >= 6 && v.id <= 8 && v.isActive)) || (this.id === 7 && Collections.activeAmount > 1)) resetCollectionsSelect()
    player.break = true;
  }

  get isCompleted() {
    return (player.challenge.normal.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    player.challenge.normal.completedBits |= 1 << this.id;
    if (player.options.updateCollectionSetAfterChallenge) {
      this.activeBits = player.colActiveBits;
    };
    EventHub.logic.dispatch(GAME_EVENT.NORMAL_CHALLENGE_COMPLETED);
  }

  get isEffectActive() {
    return this.isRunning;
  }
  
  get goal() {
    return Decimal.NUMBER_MAX_VALUE
  }

  /**
   * @return {NormalChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  updateChallengeTime() {
    const bestTimes = player.challenge.normal.bestTimes;
    if (bestTimes[this.id - 1] <= player.records.thisSteamer.time) {
      return;
    }
    player.challenge.normal.bestTimes[this.id - 1] = player.records.thisSteamer.time;
    GameCache.normalChallengeTimeSum.invalidate();
  }

  exit() {
    player.challenge.normal.current = 0;
    steamerChall();
  }
}

/**
 * @param {number} id
 * @return {NormalChallengeState}
 */
export const NormalChallenge = NormalChallengeState.createAccessor(GameDatabase.challenges.normal);

/**
 * @returns {NormalChallengeState}
 */
Object.defineProperty(NormalChallenge, "current", {
  get: () => (player.challenge.normal.current > 0
    ? NormalChallenge(player.challenge.normal.current)
    : undefined),
});

Object.defineProperty(NormalChallenge, "isRunning", {
  get: () => NormalChallenge.current !== undefined,
});


export const NormalChallenges = {
  /**
   * @type {NormalChallengeState[]}
   */
  all: NormalChallenge.index.compact(),
  completeAll() {
    for (const challenge of NormalChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.normal.completedBits = 0;
  },
  /**
   * @returns {NormalChallengeState[]}
   */
  get completed() {
    return NormalChallenges.all.filter(c => c.isCompleted);
  },
  
  get requirement() {
    return DC.E2024;
  }
};
