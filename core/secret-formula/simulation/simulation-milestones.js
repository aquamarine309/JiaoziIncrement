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
    description: () => `解锁更多蒸笼自动购买器的模式，大幅降低制造器价格增速，自动解锁工厂，解锁自动终止模拟。终止模拟后保留一次外卖${formatInt(4)}。`
  },
  energyRate: {
    id: 12,
    cores: 80,
    description: () => `重置升级时的效率提升至${formatPercents(0.95)}。`,
    effect: 0.95
  },
  reviewBoost: {
    id: 13,
    cores: 1e3,
    description: () => `"温故"升级的底数增加${formatPercents(0.2)}。`,
    effect: 1.2
  },
  reviewMaker: {
    id: 14,
    cores: 3e3,
    description: () => `每个"温故"升级为购买一个制造器的乘数提供${formatX(1.2, 0, 1)}的倍数。`,
    effect: () => Decimal.pow(1.2, SimulationRebuyableGroup.totalBought),
    formatEffect: value => formatX(value, 0, 2)
  },
  factoryMaker: {
    id: 15,
    cores: 5e3,
    description: () => "微型蘸料工厂生产最高级制造器。",
    effect: () => Factory(1).productionPerSecond.minus(1).clampMin(0),
    formatEffect: value => `${format(value, 2)}每秒`
  },
  coreBoost: {
    id: 16,
    cores: 1e4,
    description: () => `基于前${formatInt(10)}次终止模拟的时间获得核心饺子和饺子能量的加成。(暂时无效)`
  },
  weakGainedColls: {
    id: 17,
    cores: 1e6,
    description: () => `饺子收集可在获得前拥有${formatPercents(0.5)}的效果。(暂时无效)`,
    effect: () => gainedCols() * 0.5
  },
  advancedSimulation: {
    id: 18,
    cores: 1e20,
    description: () => "解锁进阶模拟。(暂时无效)"
  }
}