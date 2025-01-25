import { DC } from "../../constants.js";

export const simulationMilestones = {
  buyingMakerBoost: {
    id: 0,
    key: "开端",
    cores: 1,
    description: () => $t("simulation_milestone_buyingMakerBoost_description", [formatPercents(0.1)]),
    effect: 1.1
  },
  qols: {
    id: 1,
    key: "游戏体验",
    cores: 2,
    description: () => $t("simulation_milestone_qols_description")
  },
  wrapperBoostFactories: {
    id: 2,
    key: "工厂饺子皮",
    cores: 3,
    description: () => $t("simulation_milestone_wrapperBoostFactories_description"),
    effect: () => Wrapper.power.pow(0.0055),
    formatEffect: value => formatX(value, 2, 3)
  },
  keepChall: {
    id: 3,
    key: "挑战稳定器",
    cores: 5,
    description: () => $t("simulation_milestone_keepChall_description")
  },
  autoFactory: {
    id: 4,
    key: "流水线工厂",
    cores: 10,
    description: () => $t("simulation_milestone_autoFactory_description")
  },
  upgrades: {
    id: 5,
    key: "再次升级",
    cores: 15,
    description: () => $t("simulation_milestone_upgrades_description")
  },
  qols2: {
    id: 11,
    key: "游戏体验2",
    cores: 32,
    description: () => `解锁更多蒸笼自动购买器的模式，大幅降低制造器价格增速，自动解锁工厂，解锁自动终止模拟。终止模拟后保留一次外卖${formatInt(4)}。`
  },
  energyRate: {
    id: 12,
    key: "节能升级",
    cores: 80,
    description: () => `重置升级时的效率提升至${formatPercents(0.95)}。`,
    effect: 0.95
  },
  reviewBoost: {
    id: 13,
    key: "温故增强器",
    cores: 1e3,
    description: () => `"温故"升级的底数增加${formatPercents(0.2)}。`,
    effect: 1.2
  },
  reviewMaker: {
    id: 14,
    key: "大墙",
    cores: 3e3,
    description: () => `每个"温故"升级为购买一个制造器的乘数提供${formatX(1.2, 0, 1)}的倍数。`,
    effect: () => Decimal.pow(1.2, SimulationRebuyableGroup.totalBought),
    formatEffect: value => formatX(value, 0, 2)
  },
  factoryMaker: {
    id: 15,
    key: "EC7启动",
    cores: 5e3,
    description: () => "微型蘸料工厂生产最高级制造器。",
    effect: () => Factory(1).productionPerSecond.minus(1).clampMin(0),
    formatEffect: value => `${format(value, 2)}每秒`
  },
  coreBoost: {
    id: 16,
    key: "竞速模拟",
    cores: 1e4,
    description: () => `基于上一次终止模拟的时间，获得核心饺子和饺子能量的加成。`,
    effect: () => Math.clamp(1e5 / player.records.recentSimulation[0].realTime, 1, 50),
    formatEffect: value => formatX(value, 2, 1),
    cap: 50
  },
  weakGainedColls: {
    id: 17,
    key: "全面自动化",
    cores: 1e6,
    description: () => `收集饺子可在获得前拥有${formatPercents(0.5)}的效果，终止模拟时不重置饺子激活状态(不保证有效)。`,
    effect: () => gainedCols() * 0.5,
    formatEffect: value => `+${format(value, 2, 1)}`
  },
  advancedSimulation: {
    id: 18,
    key: "最终结局",
    cores: Number.MAX_VALUE,
    description: () => "解锁进阶模拟。"
  }
}