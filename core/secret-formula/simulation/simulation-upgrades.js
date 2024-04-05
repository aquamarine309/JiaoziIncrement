import {
  DC
}
from "../../constants.js";

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
      formatX(props.effectMult, 1, 1),
      pluralize($t(props.purpose), 0, null, "")
    ]
  );
  props.formatEffect = value => formatX(value, 1, 1);
  props.formatCost = value => format(value, 2, 0);
  return props;
};

export const simulationUpgrades = {
  review: {
    makerBoost: rebuyable({
      id: 0,
      purpose: "maker",
      effectMult: 1e10,
      initialCost: 60,
      costMult: 30
    }),
    factoryBoost: rebuyable({
      id: 1,
      purpose: "factory",
      effectMult: 10,
      initialCost: 200,
      costMult: 40
    }),
    wrapperBoost: rebuyable({
      id: 2,
      purpose: "wrapper",
      effectMult: 1.2,
      initialCost: 800,
      costMult: 60
    }),
    coreBoost: rebuyable({
      id: 3,
      purpose: "core",
      effectMult: 2,
      initialCost: 1e3,
      costMult: 80
    }),
    energyBoost: rebuyable({
      id: 4,
      purpose: "energy",
      effectMult: 3,
      initialCost: 3.6e3,
      costMult: 100
    })
  },
  preview: {
    moneyMaker: {
      id: 0,
      description: "你可以用饺子币购买制造器",
      cost: 1,
    },
    moreMilestone: {
      id: 1,
      description: "解锁更多模拟里程碑",
      cost: 2,
    },
    unlockColShop: {
      id: 2,
      description: "解锁收集商店",
      cost: 3
    },
    unlockNewMixture: {
      id: 3,
      description: "解锁更多酱料",
      cost: 5
    },
    unlockNewTask: {
      id: 4,
      description: "解锁新的任务"
    }
  }
}