import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js";

export class SteamerUpgradeState extends SetPurchasableMechanicState {

  get currency() {
    return Currency.steamerCoins;
  }

  get set() {
    return player.steamerUpgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (super.purchase()) {
      EventHub.dispatch(GAME_EVENT.STEAMER_UPGRADE_BOUGHT);
      return true;
    }
    return false;
  }
}

export function preProductionGenerateSC(diff) {
  if (SteamerUpgrade.scGen.isBought) {
    const genPeriod = Time.bestSteamer.totalMilliseconds * 5;
    let genCount;
    if (diff >= 1e300 * genPeriod) {
      genCount = Decimal.div(diff, genPeriod);
    } else {
      // Partial progress (fractions from 0 to 1) are stored in player.partInfinityPoint
      player.partSteamerCoins += diff / genPeriod;
      genCount = Math.floor(player.partSteamerCoins);
      player.partSteamerCoins -= genCount;
    }
    let gainedPerGen = player.records.bestSteamer.time >= 999999999999 ? DC.D0 : SteamerUpgrade.scGen.effectValue;
    const gainedThisTick = new Decimal(genCount).times(gainedPerGen);
    Currency.steamerCoins.add(gainedThisTick);
  }
}

class SteamerSCMultUpgrade extends GameMechanicState {
  get cost() {
    if (this.purchaseCount >= this.purchasesAtIncrease) {
      return this.config.costIncreaseThreshold
        .times(Decimal.pow(this.costIncrease, this.purchaseCount - this.purchasesAtIncrease));
    }
    return Decimal.pow(this.costIncrease, this.purchaseCount + 1);
  }

  get purchaseCount() {
    return player.SCMultPurchases;
  }

  get purchasesAtIncrease() {
    return this.config.costIncreaseThreshold.log10() - 1;
  }

  get hasIncreasedCost() {
    return this.purchaseCount >= this.purchasesAtIncrease;
  }

  get costIncrease() {
    return this.hasIncreasedCost ? 1e10 : 10;
  }

  get isCapped() {
    return this.cost.gte(this.config.costCap);
  }

  get isBought() {
    return this.isCapped;
  }

  get isRequirementSatisfied() {
    return NormalChallenge(6).isCompleted;
  }

  get canBeBought() {
    return !this.isCapped && Currency.steamerCoins.gte(this.cost) && this.isRequirementSatisfied;
  }

  // This is only ever called with amount = 1 or within buyMax under conditions that ensure the scaling doesn't
  // change mid-purchase
  purchase(amount = 1) {
    if (!this.canBeBought) return;
      Autobuyer.steamer.bumpAmount(DC.D2.pow(amount));
    Currency.steamerCoins.subtract(Decimal.sumGeometricSeries(amount, this.cost, this.costIncrease, 0));
    player.SCMultPurchases += amount;
    GameUI.update();
  }

  buyMax() {
    if (!this.canBeBought) return;
    if (!this.hasIncreasedCost) {
      // Only allow IP below the softcap to be used
      const availableSC = Currency.steamerCoins.value.clampMax(this.config.costIncreaseThreshold);
      const purchases = Decimal.affordGeometricSeries(availableSC, this.cost, this.costIncrease, 0).toNumber();
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
    // Do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to (but not including) 1e3000000 and then
    // it will go in this part)
    if (this.hasIncreasedCost) {
      const availableSC = Currency.steamerCoins.value.clampMax(this.config.costCap);
      const purchases = Decimal.affordGeometricSeries(availableSC, this.cost, this.costIncrease, 0).toNumber();
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
  }
}

export const SteamerUpgrade = mapGameDataToObject(
  GameDatabase.steamer.upgrades,
  config => (config.id === "coinMult" ? 
    new SteamerSCMultUpgrade(config) : 
    new SteamerUpgradeState(config))
);