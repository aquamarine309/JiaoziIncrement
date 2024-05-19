import { DC } from "./constants.js";


/**
 * @abstract
 */
class MathOperations {
  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  add(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  subtract(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  multiply(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  divide(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  max(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  min(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  eq(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gte(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lte(left, right) { throw new NotImplementedError(); }
}

MathOperations.number = new class NumberMathOperations extends MathOperations {
  add(left, right) { return left + right; }
  subtract(left, right) { return left - right; }
  multiply(left, right) { return left * right; }
  divide(left, right) { return left / right; }
  max(left, right) { return Math.max(left, right); }
  min(left, right) { return Math.min(left, right); }
  eq(left, right) { return left === right; }
  gt(left, right) { return left > right; }
  gte(left, right) { return left >= right; }
  lt(left, right) { return left < right; }
  lte(left, right) { return left <= right; }
}();

MathOperations.decimal = new class DecimalMathOperations extends MathOperations {
  add(left, right) { return Decimal.add(left, right); }
  subtract(left, right) { return Decimal.subtract(left, right); }
  multiply(left, right) { return Decimal.multiply(left, right); }
  divide(left, right) { return Decimal.divide(left, right); }
  max(left, right) { return Decimal.max(left, right); }
  min(left, right) { return Decimal.min(left, right); }
  eq(left, right) { return Decimal.eq(left, right); }
  gt(left, right) { return Decimal.gt(left, right); }
  gte(left, right) { return Decimal.gte(left, right); }
  lt(left, right) { return Decimal.lt(left, right); }
  lte(left, right) { return Decimal.lte(left, right); }
}();

/**
 * @abstract
 */
export class Currency {
  /**
   * @abstract
   */
  get value() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set value(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   * @type {MathOperations}
   */
  get operations() { throw new NotImplementedError(); }

  add(amount) {
    this.value = this.operations.add(this.value, amount);
  }

  subtract(amount) {
    this.value = this.operations.max(this.operations.subtract(this.value, amount), 0);
  }

  multiply(amount) {
    this.value = this.operations.multiply(this.value, amount);
  }

  divide(amount) {
    this.value = this.operations.divide(this.value, amount);
  }

  eq(amount) {
    return this.operations.eq(this.value, amount);
  }

  gt(amount) {
    return this.operations.gt(this.value, amount);
  }

  gte(amount) {
    return this.operations.gte(this.value, amount);
  }

  lt(amount) {
    return this.operations.lt(this.value, amount);
  }

  lte(amount) {
    return this.operations.lte(this.value, amount);
  }

  purchase(cost) {
    if (!this.gte(cost)) return false;
    this.subtract(cost);
    return true;
  }

  bumpTo(value) {
    this.value = this.operations.max(this.value, value);
  }

  dropTo(value) {
    this.value = this.operations.min(this.value, value);
  }

  get startingValue() { throw new NotImplementedError(); }

  reset() {
    this.value = this.startingValue;
  }
}

/**
 * @abstract
 */
class NumberCurrency extends Currency {
  get operations() { return MathOperations.number; }
  get startingValue() { return 0; }
}

/**
 * @abstract
 */
class DecimalCurrency extends Currency {
  get operations() { return MathOperations.decimal; }
  get mantissa() { return this.value.mantissa; }
  get exponent() { return this.value.exponent; }
  get startingValue() { return DC.D0; }
}
window.DecimalCurrency = DecimalCurrency;

Currency.jiaozi = new class extends DecimalCurrency {
  
  get value() { return player.jiaozi; }
  
  set value(value) {
    player.records.thisBigReset.maxJiaozi = player.records.thisBigReset.maxJiaozi.max(value);
    player.records.thisSteamer.maxJiaozi = player.records.thisSteamer.maxJiaozi.max(value);
    player.records.thisSimulation.maxJiaozi = player.records.thisSimulation.maxJiaozi.max(value);
    player.jiaozi = value;
  }
  
  add(amount) {
    super.add(amount);
    if (amount.gt(0)) {
      player.records.totalJiaozi = player.records.totalJiaozi.add(amount);
    }
  }
  
  get startingValue() {
    return DC.E1;
  }
}()

Currency.money = new class extends DecimalCurrency {

  get value() { return player.money; }
  
  set value(value) {
    player.records.thisBigReset.maxMoney = player.records.thisBigReset.maxMoney.max(value);
    player.records.thisSteamer.maxMoney = player.records.thisSteamer.maxMoney.max(value);
    player.records.thisSimulation.maxMoney = player.records.thisSimulation.maxMoney.max(value);
    player.money = value;
  }
}()

Currency.bigResetCount = new class extends DecimalCurrency {
  get value() {
    return player.bigResetCount;
  }
  
  set value(amount) {
    player.bigResetCount = amount;
  }
}()

Currency.steamerCount = new class extends DecimalCurrency {
  get value() {
    return player.steamerCount;
  }
  
  set value(amount) {
    player.steamerCount = amount;
  }
}()

Currency.steamerCoins = new class extends DecimalCurrency {

  get value() { return player.steamerCoins; }
  
  set value(value) {
    player.steamerCoins = value;
    player.records.thisSimulation.maxSC = player.records.thisSimulation.maxSC.max(value);
  }
}()

Currency.mixtures = new class extends DecimalCurrency {
  get value() { return player.mixtures; }
  
  set value(value) {
    player.mixtures = value;
  }
}()

Currency.cores = new class extends DecimalCurrency {
  get value() { return player.cores; }
  
  set value(value) {
    player.cores = value;
  }
}()

Currency.simulations = new class extends DecimalCurrency {
  get value() { return player.simulations; }
  
  set value(value) {
    player.simulations = value;
  }
}()

Currency.energy = new class extends DecimalCurrency {
  get value() { return player.simulation.energy; }
  
  set value(value) {
    player.simulation.energy = value;
  }
}

Currency.amplificationPoints = new class extends NumberCurrency {
  get value() { return player.amplificationPoints; }
  
  set value(value) {
    player.amplificationPoints = value;
  }
}