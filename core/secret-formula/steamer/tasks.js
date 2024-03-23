import { DC } from "../../constants.js"

export const tasks = {
  mixtures: {
    id: 1,
    key: "mixtures",
    descriptionTemp: value => `拥有 ${format(value)} 个蘸料瓶`,
    goal: count => {
      return DC.E50.times(DC.E25.pow(count))
    },
    howMany: () => {
      return (Currency.mixtures.exponent - 50) / 25;
    },
    percents: (goal, lastGoal = DC.D1) => Currency.mixtures.value.div(lastGoal).pLog10() / goal.div(lastGoal).log10(),
    reward: {
      description: "提高工厂的效率",
      formatEffect: value => formatX(value, 2),
      effectFn: count => {
        return DC.E1.pow(count)
      }
    }
  },
  wrapper: {
    id: 2,
    key: "wrapper",
    descriptionTemp: value => `拥有 ${format(value, 2)} 个饺子皮`,
    goal: count => 1600 + 240 * count,
    howMany: () => (Wrapper.totalAmount - 1600) / 240,
    percents: (goal, lastGoal = 0) => (Wrapper.totalAmount - lastGoal) / (goal - lastGoal),
    reward: {
      description: "增加纯金饺的上限",
      effectFn: count => Math.pow(count + 1, 2),
      formatEffect: value => formatX(value, 2)
    }
  },
  steamer: {
    id: 3,
    key: "steamer",
    descriptionTemp: value => `拥有 ${format(value)} 个蒸笼币`,
    goal: count => DC.E190.times(DC.E20.pow(count)),
    howMany: () => (Currency.steamerCoins.exponent - 190) / 20,
    percents: (goal, lastGoal = DC.D1) => Currency.steamerCoins.value.div(lastGoal).pLog10() / goal.div(lastGoal).log10(),
    reward: {
      description: "增加山竹醇饺的上限",
      effectFn: count => Math.pow(count + 1, 0.61),
      formatEffect: value => formatX(value, 2, 3)
    }
  },
  collections: {
    id: 4,
    key: "collections",
    descriptionTemp: value => `激活小于${formatInt(4)}个收集饺子时达到 ${format(value)} 个饺子`,
    goal: count => DC.E30000.times(DC.E5000.pow(count)),
    howMany: () => (Currency.jiaozi.exponent - 30000) / 5000,
    percents: (goal, lastGoal = DC.D1) => {
      return Currency.jiaozi.value.div(lastGoal).pLog10() / goal.div(lastGoal).log10()
    },
    condition: () => Collections.activeAmount < 4,
    cap: 3,
    reward: {
      description: "可同时激活更多饺子",
      effectFn: count => count,
      formatEffect: value => `+${formatInt(value)}`
    }
  }
}