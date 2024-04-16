import { DC } from "../../constants.js";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
  SimulationRebuyableGroup.totalBought,
  1e30,
  props.initialCost,
  props.costMult,
  props.costMult / 10,
  DC.E309,
  1e3,
  props.initialCost * props.costMult);
  props.effect = () => Decimal.pow(
    props.effectMult * SimulationMilestone.reviewBoost.effectOrDefault(1),
    player.simulation.upgrades.review[props.id]
  );
  props.description = () => $t(
    "reviewTemp",
    [
      formatX(props.effectMult * SimulationMilestone.reviewBoost.effectOrDefault(1), 2, 2),
      pluralize($t(props.purpose), 0, null, "")
    ]
  );
  props.formatEffect = value => formatX(value, 2, 2);
  props.formatCost = value => format(value, 2, 0);
  return props;
};

export const simulationUpgrades = {
  review: {
    makerBoost: rebuyable({
      id: 0,
      purpose: "maker",
      effectMult: 1e60,
      initialCost: 60,
      costMult: 12
    }),
    factoryBoost: rebuyable({
      id: 1,
      purpose: "factory",
      effectMult: 100,
      initialCost: 100,
      costMult: 20
    }),
    wrapperBoost: rebuyable({
      id: 2,
      purpose: "wrapper",
      effectMult: 1.23,
      initialCost: 150,
      costMult: 40
    }),
    coreBoost: rebuyable({
      id: 3,
      purpose: "core",
      effectMult: 2.5,
      initialCost: 1e3,
      costMult: 56
    }),
    energyBoost: rebuyable({
      id: 4,
      purpose: "energy",
      effectMult: 5,
      initialCost: 3.6e3,
      costMult: 64
    })
  },
  preview: {
    moneyMaker: {
      id: 0,
      description: () => `你可以用饺子币购买制造器，每次重置后保留${formatInt(1)}个饺子制造器，购买制造器的倍数${formatPow(2)}`,
      cost: 80,
      effects: {
        startingMaker: DC.D1,
        makerPow: 2
      },
      formatCost: value => format(value, 2),
      requirement: () => quantify($t("sc"), DC.E1000, 2),
      checkRequirement: () => Currency.steamerCoins.gt(DC.E1000)
    },
    moreMilestone: {
      id: 1,
      description: "解锁更多模拟里程碑",
      cost: 200,
      formatCost: value => format(value, 2),
      requirement: () => `购买"温故"升级 ${formatInt(6)} 次`,
      checkRequirement: () => SimulationRebuyableGroup.totalBought >= 6
    },
    unlockColShop: {
      id: 2,
      description: "解锁收集商店",
      cost: 1e5,
      formatCost: value => format(value, 2),
      requirement: () => "待定",
      checkRequirement: () => false
    },
    unlockNewMixture: {
      id: 3,
      description: "解锁更多蘸料",
      cost: 3e7,
      formatCost: value => format(value, 2),
      requirement: () => "五小时后更新",
      checkRequirement: () => false
    },
    unlockNewTask: {
      id: 4,
      description: "解锁新的外卖订单",
      cost: 4e10,
      formatCost: value => format(value, 2),
      requirement: () => "五小时后更新",
      checkRequirement: () => false
    }
  }
}