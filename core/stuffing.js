import { DC } from "./constants.js"

export class Stuffing {
  static get name() {
    return  $t("stuffing");
  }
  
  static get cost() {
    if (this.canBigReset) return DC.E50;
    if (this.canBigReset && this.simulationStuffingUnlocked) return DC.E1000.pow(this.amount - this.bigResetAmount).times(DC.E150);
    let cost = new Decimal([3e3, 1e7, 8e13, 1e20, 1e32, 1e46, 1e68, 1e150][this.amount]);
    cost = cost.dividedByEffectOf(Collections.adofai);
    cost = cost.timesEffectOf(NormalChallenge(3));
    return cost;
  }
  
  /**@type {Number} */
  static get amount() {
    return player.stuffing;
  }
  
  static set amount(value) {
    player.stuffing = value;
  }
  
  static get cap() {
    if (NormalChallenge(6).isRunning) return 2;
    let cap = 4;
    if (Collections.adofai.isEffectActive) ++cap;
    if (NormalChallenge(7).isRunning) return cap;
    if (SteamerUpgrade.nextMaker1.isEffectActive) ++cap;
    if (SteamerUpgrade.nextMaker2.isEffectActive) ++cap;
    if (SteamerUpgrade.nextMaker3.isEffectActive) ++cap;
    if (SteamerUpgrade.nextMaker4.isEffectActive) ++cap;
    return cap;
  }
  
  static get bigResetAmount() {
    return this.cap - 1;
  }
  
  static get canBeBought() {
    if (this.amount >= this.cap) return false;
    return true;
  }
  
  static get simulationAmount() {
    return player.simulationStuffing;
  }
  
  static simulationStuffingUnlocked() {
    return false;
  }
  
  static unlockedText() {
    if (this.amount >= this.cap) return $t("capped");
    return $t("locked");
  }
  
  static get isSatisfied() {
    return Currency.money.gte(this.cost) && (player.break || !Player.canFixSteamer);
  }
  
  static add(amount) {
    this.amount = Math.min(amount + this.amount, this.bigResetAmount);
  }
  
  static get canBigReset() {
    return this.bigResetAmount === this.amount;
  }
  
  //最终判定
  static get bigResetCheck() {
    return (this.canBigReset || SteamerUpgrade.resetRequirement.isEffectActive) && Currency.money.gte(1e50) && (player.break || !Player.canFixSteamer);
  }
}

function stuffingReset(tempBulk) {
  const bulk = Math.min(tempBulk, Stuffing.bigResetAmount - Stuffing.amount);
  EventHub.dispatch(GAME_EVENT.STUFFING_BEFORE,bulk)
  let bulkLeft = bulk;
  while (Currency.money.purchase(Stuffing.cost) && bulkLeft > 0) {
    Stuffing.add(1);
    bulkLeft--;
  }
  Currency.jiaozi.reset();
  Makers.reset();
  resetChallengeStuff();
  EventHub.dispatch(GAME_EVENT.STUFFING_AFTER, bulk);
}


export function manualRequestStuffing(bulk = 1) {
  if (!Stuffing.isSatisfied || !Stuffing.canBeBought) return;
  if (Stuffing.canBigReset) {
    requestBigReset();
    return;
  }
  requestStuffing(bulk);
}

export function requestBigReset() {
  if (!Stuffing.bigResetCheck) return;
  bigReset();
}

export function requestStuffing(bulk) {
  if (!Stuffing.isSatisfied || !Stuffing.canBeBought) return;
  
  Tutorial.turnOffEffect(TUTORIAL_STATE.STUFFING);
  stuffingReset(bulk);
}

export function gainedCols() {
  if (Player.isInAnyChallenge) return 0;
  if (player.money.lt(1e50)) return 1;
  const amount = Math.max(1, 4 * Math.sqrt((player.money.add(1).log10() - 50) * 0.08) + 1);
  let bulk = 1;
  if (Collections.cat.isEffectActive) bulk = Math.floor(amount * bulk);
  bulk *= Effects.product(
    NormalChallenge(3).reward,
    SteamerUpgrade.collectionsMult,
    MixtureTypes.vinegar,
    Achievement(36)
  );
  return bulk;
}

function bigReset() {
  if (!Stuffing.bigResetCheck) return;
  EventHub.dispatch(GAME_EVENT.BIG_RESET_BEFORE);
  if (!PlayerProgress.collectionUnlocked()) {
    player.seed = player.initialSeed;
  };
  const bulk = gainedCols();
  const weight = Math.clamp(4 * Math.sqrt((player.money.add(1).log10() - 50) * 0.08), 0, 4);
  if (!Player.isInNormalChallenge) {
    collectionGenerator({
      common: 12 + weight, 
      uncommon: 9 + 1.1 * weight, 
      rare: 7 + 1.15 * weight, 
      epic: 5 + 1.2 * weight, 
      legendary: 0.8 + 1.08 * weight,
      bulk
    })
  }
  if (player.needResetCols || Collections.activeAmount > Collections.maxActiveAmount) {
    resetCollectionsSelect();
  }
  Currency.jiaozi.reset();
  Currency.money.reset();
  Makers.reset();
  player.maxResetJiaozi = DC.D0;
  player.records.thisBigReset.maxJiaozi = DC.E1;
  player.records.thisBigReset.maxMoney = DC.D0;
  player.records.bestBigReset.time = Math.min(player.records.bestBigReset.time, player.records.thisBigReset.time);
  player.records.bestBigReset.realTime = Math.min(player.records.bestBigReset.realTime, player.records.thisBigReset.realTime);
  player.records.thisBigReset.time = 0;
  player.records.thisBigReset.realTime = 0;
  player.records.thisSale.time = 0;
  player.records.thisSale.realTime = 0;
  player.records.thisBigReset.bestColMin = 0;
  player.records.thisBigReset.bestColMinValue = 0;
  resetChallengeStuff();
  if (SteamerUpgrade.keepWrapper.isEffectActive) {
    Wrapper.amount = Math.floor(Wrapper.amount / 2);
  } else {
    Wrapper.amount = 0;
  }
  if (SteamerUpgrade.keepStuffing.isEffectActive) {
    Stuffing.amount = Math.min(Stuffing.amount, Stuffing.bigResetAmount);
  } else {
    Stuffing.amount = 0;
  };
  player.bigResetCount = player.bigResetCount.add(1);
  EventHub.dispatch(GAME_EVENT.BIG_RESET_AFTER);
}
