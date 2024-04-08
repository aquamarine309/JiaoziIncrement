import { DC } from "../../constants.js";

export const simulationMilestones = {
  buyingMakerBoost: {
    id: 0,
    cores: 1,
    description: () => $t("SM_buyingMakerBoost", [formatPercents(0.1)]),
    effect: 1.1
  },
  qols: {
    id: 1,
    cores: 2,
    description: () => $t("SM_qols")
  },
  wrapperBoostFactories: {
    id: 2,
    cores: 3,
    description: () => $t("SM_wrapperBoostFactories"),
    effect: () => Wrapper.power.pow(0.0055),
    formatEffect: value => formatX(value, 2, 3)
  },
  keepChall: {
    id: 3,
    cores: 5,
    description: () => $t("SM_keepChall")
  },
  autoFactory: {
    id: 4,
    cores: 10,
    description: () => $t("SM_autoFactory")
  },
  upgrades: {
    id: 5,
    cores: 15,
    description: () => $t("SM_upgrades")
  },
  qols2: {
    id: 11,
    cores: 32,
    description: () => `解锁更多蒸笼自动购买器的模式，大幅降低制造器价格增速，自动解锁工厂。`
  },
  factoryMaker: {
    id: 12,
    cores: 80,
    description: () => "微型蘸料工厂生产最高级制造器。",
    effect: () => Factory(1).productionPerSecond.minus(1).clampMin(0),
    formatEffect: value => `${format(value, 2)}每秒`
  },
  energyRate: {
    id: 13,
    cores: 300,
    description: () => `重置升级时的效率提升至${formatPercents(0.95)}。`,
    effect: 0.95
  }
}