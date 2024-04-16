import { DC } from './constants.js'

export function saleReset() {
  if (!Sale.isAvailable) return false;
  EventHub.dispatch(GAME_EVENT.SALE_BEFORE);
  player.records.thisSale.time = 0;
  player.records.thisSale.realTime = 0;
  Currency.money.add(gainedMoney());
  player.maxResetJiaozi = Decimal.max(player.jiaozi, player.maxResetJiaozi);
  Currency.jiaozi.reset();
  EventHub.dispatch(GAME_EVENT.SALE_AFTER);
  return true;
}

export function gainedMoney() {
  let jiaozi = player.jiaozi;
  jiaozi = jiaozi.powEffectOf(NormalChallenge(2));
  const isMoreThanMax = jiaozi.gt(player.maxResetJiaozi);
  let unit = DC.D0_390895;
  const calcLessPart = j => {
    return j.pow(0.85).times(unit);
  }
  let result;
  if (Collections.fire.isEffectActive) {
    result = jiaozi.times(unit);
  } else if (isMoreThanMax) {
    const morePart = jiaozi.minus(player.maxResetJiaozi);
    result = calcLessPart(player.maxResetJiaozi).add(morePart.times(unit));
  } else {
    result = calcLessPart(jiaozi);
  }
  result = result.powEffectOf(Collections.garcinol);
  return result;
}

export class Sale {
  
  static get requirement() {
    if (NormalChallenge(4).isRunning) return 1e21;
    if (Collections.adofai.isEffectActive) return 50;
    return 1000;
  }
  
  static get isAvailable() {
    return Currency.jiaozi.gte(this.requirement) && (player.break || !Player.canFixSteamer);
  }
  
  static get unavailableText() {
    if (Currency.jiaozi.lt(this.requirement)) return $t("atLeast", [quantify($t("jiaozi"), this.requirement, 2)]);
    return $t("cannotSale");
  }
}

