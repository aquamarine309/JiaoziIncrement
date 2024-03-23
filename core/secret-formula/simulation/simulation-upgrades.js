import { DC } from "../../constants.js";

export const simulationUpgrades = {
  review: {
    id: "review",
    name: () => $t("rewiew"),
    initialCost: 60,
    costMult: 30,
    upgrades: [
      {
        id: 0,
        description: () => $t("makerBoost", [format(1e10)]),
        effect: 1e10,
        initialCost: 60,
        costMult: 30
      },
      {
        id: 1,
        description: () => $t("factoryBoost", [format(10)]),
        effect: 10,
        initialCost: 200,
        costMult: 40
      },
      {
        id: 2,
        description: () => $t("wrapperBoost", [format(1.2, 1)]),
        effect: 1.2,
        initialCost: 800,
        costMult: 60
      },
      {
        id: 3,
        description: () => $t("buyMakerBoost", [format(2, 1)]),
        effect: 2,
        initialCost: 1e3,
        costMult: 80
      },
      {
        id: 4,
        description: () => $t("energyBoost", [format(3, 1)]),
        effect: 3,
        initialCost: 3.6e3,
        costMult: 100
      }
    ]
  }
}