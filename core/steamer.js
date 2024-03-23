import { DC } from "./constants.js";
import FullScreenAnimationHandler from "./full-screen-animation-handler.js";

export function manualSteamerRequest() {
  if (!Player.canFixSteamer) return;
  if (player.options.confirmations.steamer && !PlayerProgress.steamerUnlocked()) {
    Modal.steamer.show();
  } else {
    steamerRequest();
  }
}

export function steamerAnimation() {
  FullScreenAnimationHandler.display("steamer", 2);
}

export function steamerRequest(animation = true) {
  if (!Player.canFixSteamer) return;
  if (animation && player.options.animations.steamer && !FullScreenAnimationHandler.isDisplaying) {
    steamerAnimation();
    setTimeout(() => steamerReset(), 1000);
  } else {
    steamerReset();
  }
}

export function steamerReset(hasReward = true) {
  if (!Player.canFixSteamer && hasReward) return;
  EventHub.dispatch(GAME_EVENT.FIX_STEAMER_BEFORE);
  if (hasReward) {
    giveSteamerRewards();
  }
  steamerResetValues();
  EventHub.dispatch(GAME_EVENT.FIX_STEAMER_AFTER);
}

export function totalSCMult() {
  let mult = DC.D1;
  mult = mult.timesEffectsOf(
    SteamerUpgrade.scMult,
    SteamerUpgrade.coinMult,
    MixtureTypes.salt
  )
  return mult;
}

export function gainedSteamerCoins() {
  const div = 308;
  const jiaozi = player.records.thisSteamer.maxJiaozi;
  let sc = player.break ? Decimal.pow10(jiaozi.log10() / div - 0.8) : new Decimal(308 / div);
  sc = sc.times(totalSCMult());
  return sc.floor();
}

function gainedSteamerCount() {
  let count = DC.D1;
  
  count = count.timesEffectOf(Achievement(24));
  return count;
}

function giveSteamerRewards() {
  Currency.steamerCoins.add(gainedSteamerCoins());
  steamerTabChange(!PlayerProgress.steamerUnlocked());
   player.records.bestSteamer.time =
   Math.min(player.records.bestSteamer.time, player.records.thisSteamer.time);
   player.records.bestSteamer.realTime =
   Math.min(player.records.bestSteamer.realTime, player.records.thisSteamer.realTime);
   Currency.steamerCount.add(gainedSteamerCount());
}

function steamerResetValues() {
  steamerUpdateStatistics();
  
  Currency.jiaozi.reset();
  Currency.money.reset();
  Makers.reset();
  Factories.resetAmount();
  Wrapper.amount = 0;
  Stuffing.amount = 0;
  Currency.bigResetCount.reset();
  
  const allChallenge = NormalChallenges.all.every(c => c.isCompleted);
  if (allChallenge || SimulationMilestone.qols.isReached) return;
  player.collections = Array.repeat(0, 9);
  player.totalColls = 0;
  
  if (SteamerUpgrade.keepCollections.isEffectActive) {
    const c1Eff = NormalChallenge(1).reward.effectOrDefault(9);
    
    player.collections = Array.repeat(c1Eff / 9, 9);
    player.totalColls = c1Eff;
  }
}

function steamerUpdateStatistics() {
  player.records.bestBigReset.time = 999999999999;
  player.records.bestBigReset.realTime = 999999999999;
  player.records.thisSteamer.bestSCmin = DC.D0;
  player.records.thisSteamer.bestSCminValue = DC.D0;
  player.records.thisBigReset.bestColMin = 0;
  player.records.thisBigReset.bestColMinValue = 0;
  player.records.thisSteamer.maxJiaozi = DC.E1;
  player.records.thisSteamer.maxMoney = DC.D0;
  player.records.thisSteamer.maxCols = 0;
  player.records.thisSteamer.time = 0;
  player.records.thisSteamer.realTime = 0;
  player.records.thisBigReset.time = 0;
  player.records.thisBigReset.realTime = 0;
  player.records.thisSale.time = 0;
  player.records.thisSale.realTime = 0;
  player.records.thisBigReset.maxJiaozi = DC.E1;
  player.records.thisBigReset.maxMoney = DC.D0;
  player.maxResetJiaozi = DC.D0;
  resetChallengeStuff();
  if (!SteamerUpgrade.keepCollections.isEffectActive || player.needResetCols || (Collections.activeAmount > Collections.maxActiveAmount)) {
    resetCollectionsSelect();
  }
}

export function steamerChall() {
  steamerReset(Player.canFixSteamer)
}

function steamerTabChange(first) {
  const earlyGame = player.records.bestSteamer.time > 60000 && !player.break;
  const inChallenge = Player.isInNormalChallenge;
  handleChallengeCompletion();

  if (first) {
    Tab.steamer.upgrades.show();
  } else if (earlyGame || (inChallenge && !player.options.retryChallenge)) {
    Tab.main.maker.show();
  }
}

function handleChallengeCompletion() {
  const challenge = Player.normalChallenge;
  if (!challenge) return;

  challenge.complete();
  challenge.updateChallengeTime();
  if (!player.options.retryChallenge) {
    player.challenge.normal.current = 0;
  }
}