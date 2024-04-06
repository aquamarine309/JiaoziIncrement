import { GameMechanicState } from "./game-mechanics/game-mechanic.js"
import { DC } from "./constants.js"

class MixtureTypeState extends GameMechanicState {
  constructor(config) {
    config.effect = () => this.config.effectFn(this.amount);
    super(config);
  }

  get name() {
    return this.config.name;
  }
  
  get amount() {
    let base = Currency.mixtures.value;
    if (base.gt(DC.E50)) base = base.pow(0.5).times(DC.E25);
    if (base.gt(DC.E600)) base = base.pow(0.25).times(DC.E450);
    return base;
  }
  
  get purpose() {
    return this.config.purpose;
  }
  
  get className() {
    return this.config.className;
  }
  
  get isEffectActive() {
    return Currency.mixtures.value.gt(0);
  }
}

export const MixtureTypes = mapGameDataToObject(
  GameDatabase.steamer.mixtureTypes,
  config => new MixtureTypeState(config)
)