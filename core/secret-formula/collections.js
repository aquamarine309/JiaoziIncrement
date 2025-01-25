import { DC } from "../constants.js"

function softCap(value, cap, pow) {
  if (value instanceof Decimal) {
    if (value.gt(cap)) {
      const _cap = Decimal.pLog10(cap);
      return Decimal.pow(10, value.pLog10() * pow + _cap * (1 - pow));
    }
    return value;
  }
  if (value > cap) {
    return Math.pow(value - cap, pow) + cap;
  }
  return value;
}

export const collections = [
  {
    id: 0,
    key: 'iteration',
    rarity: COLLEACTION_RARITY.COMMON,
    description() {
      return $t("collection_1_description")
    },
    effectFn: amount => Decimal.pow(amount, 1.05).times(2).add(1).powEffectOf(SteamerUpgrade.commonPower),
    formatEffect: value => formatX(value, 2, 3),
    amplificationPoints: 1
  },
  {
    id: 1,
    key: 'dragon',
    rarity: COLLEACTION_RARITY.COMMON,
    description() {
      return $t("collection_2_description")
    },
    effectFn: x => {
      let amount = softCap(x, 1e7, 0.7);
      amount = softCap(amount, 1e8, 0.5);
      amount = softCap(amount, 1e12, 0.2);
      return softCap(Decimal.pow(5, Math.pow(amount, 0.6)).powEffectOf(SteamerUpgrade.commonPower), DC.E18000, 0.3);
    },
    formatEffect: value => `/${format(value, 2, 3)}`,
    softcap: 2.3078287797e11,
    amplificationPoints: 1
  },
  {
    id: 2,
    key: 'antimatter',
    rarity: COLLEACTION_RARITY.UNCOMMON,
    description() {
      return $t("collection_3_description")
    },
    effectFn: amount => Decimal.pow(amount, 0.6).times(9).times(Decimal.pow(15, Math.pow(Math.log10(amount / 1e9 + 1), 2))).add(1),
    formatEffect: value => formatX(value, 2, 3),
    amplificationPoints: 1
  },
  {
    id: 3,
    key: 'cat',
    rarity: COLLEACTION_RARITY.UNCOMMON,
    description() {
      return $t("collection_4_description")
    },
    effectFn: x => {
      let amount = x;
      if (amount > 1500) amount = Math.sqrt(x - 1500) * 2 + 1500;
      amount = softCap(amount, 5e5, 0.4);
      return Math.pow(amount, 0.3) + 1;
    },
    formatEffect: value => `+${quantify($t("wra"), value, 2, 2)}/${$t("stu")}`,
    softcap: 6.2125564e10,
    amplificationPoints: 2
  },
  {
    id: 4,
    key: "golden",
    rarity: COLLEACTION_RARITY.RARE,
    description() { return $t("collection_5_description") },
    effectFn: amount => Decimal.pow(amount, 0.25).times(0.12).add(1),
    formatEffect: value => formatX(value, 2, 4),
    cappedAmount: () => (1500 + NormalChallenge(8).reward.effectOrDefault(0)) * Task.wrapper.reward.effectOrDefault(1),
    amplificationPoints: 3
  },
  {
    id: 5,
    key: 'fast',
    rarity: COLLEACTION_RARITY.RARE,
    description() {
      return $t("collection_6_description")
    },
    effectFn: amount => Decimal.pow(amount, 0.25).times(0.04).add(1),
    formatEffect: value => formatX(value, 2, 4),
    cappedAmount: 2e5,
    amplificationPoints: 2
  },
  {
    id: 6,
    key: 'garcinol',
    rarity: COLLEACTION_RARITY.EPIC,
    description() { return $t("collection_7_description") },
    effectFn: amount => Decimal.pow(amount + 1, 0.5).times(0.01).add(0.99),
    formatEffect: value => formatPow(value, 2, 3),
    cappedAmount: () => 1200 * Task.steamer.reward.effectOrDefault(1),
    amplificationPoints: 3
  },
  {
    id: 7,
    key: "fire",
    rarity: COLLEACTION_RARITY.EPIC,
    description() {
      return $t("collection_8_description")
    },
    effectFn: amount => {
      return softCap(Currency.money.value.pow(0.028).times(Math.pow(amount, 0.5)).add(1), DC.E1000, 0.3)
    },
    formatEffect: value => formatX(value, 2, 3),
    amplificationPoints: 3
  },
  {
    id: 8,
    key: 'adofai',
    rarity: COLLEACTION_RARITY.LEGENDARY,
    description() {
      return $t("collection_9_description", [quantifyInt($t("jiaozi"), 50)])
    },
    effectFn: amount => Decimal.pow(10, Math.pow(softCap(amount, 1e10, 0.3), 0.2)),
    softcap: 1e10,
    formatEffect: value => `/${format(value, 2, 3)}`,
    amplificationPoints: 4
  }
]