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
    props.effectMult,
    player.simulation.upgrades.review[props.id]
  );
  props.description = () => $t(
    "reviewTemp",
    [
      formatX(props.effectMult, 2, 2),
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
      effectMult: 1e30,
      initialCost: 60,
      costMult: 20
    }),
    factoryBoost: rebuyable({
      id: 1,
      purpose: "factory",
      effectMult: 10,
      initialCost: 200,
      costMult: 35
    }),
    wrapperBoost: rebuyable({
      id: 2,
      purpose: "wrapper",
      effectMult: 1.23,
      initialCost: 800,
      costMult: 52
    }),
    coreBoost: rebuyable({
      id: 3,
      purpose: "core",
      effectMult: 1.8,
      initialCost: 1e3,
      costMult: 75
    }),
    energyBoost: rebuyable({
      id: 4,
      purpose: "energy",
      effectMult: 5,
      initialCost: 3.6e3,
      costMult: 80
    })
  },
  preview: {
    moneyMaker: {
      id: 0,
      description: () => `你可以用饺子币购买制造器，每次重置后保留${formatInt(10)}个饺子币`,
      cost: 80,
      effect: 10,
      formatCost: value => format(value, 2),
      requirement: () => quantify($t("sc"), DC.E1000, 2),
      checkRequirement: () => Currency.steamerCoins.gt(DC.E1000)
    },
    moreMilestone: {
      id: 1,
      description: "解锁更多模拟里程碑",
      cost: 400,
      formatCost: value => format(value, 2),
      requirement: () => `购买"温故"升级 ${formatInt(10)} 次`,
      checkRequirement: () => SimulationRebuyableGroup.totalBought >= 10
    },
    unlockColShop: {
      id: 2,
      description: "解锁收集商店",
      cost: 1e3,
      formatCost: value => format(value, 2),
      requirement: () => "五小时后更新",
      checkRequirement: () => false
    },
    unlockNewMixture: {
      id: 3,
      description: "解锁更多蘸料",
      cost: 3e3,
      formatCost: value => format(value, 2),
      requirement: () => "五小时后更新",
      checkRequirement: () => false
    },
    unlockNewTask: {
      id: 4,
      description: "解锁新的任务",
      cost: 4e3,
      formatCost: value => format(value, 2),
      requirement: () => "五小时后更新",
      checkRequirement: () => false
    }
  }
}