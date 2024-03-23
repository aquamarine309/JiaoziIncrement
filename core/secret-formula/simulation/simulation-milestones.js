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
    effect: () => Wrapper.power.pow(0.002),
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
  }
}