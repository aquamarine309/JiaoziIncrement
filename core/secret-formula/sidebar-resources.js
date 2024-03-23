export const sidebarResources = [
  // Note: ID 0 is interpreted in the Vue component as "the largest unlocked ID" - do not use ID 0
  {
    id: 1,
    optionName: "blob",
    isAvailable: () => false,
    // This is a dummy value to prevent vue errors
    value: () => new Decimal(1),
    formatValue: () => "\uE010",
    formatClass: "o-sidebar-currency--jiaozi",
  },
  {
    id: 2,
    optionName: "jiaozis",
    isAvailable: () => true,
    value: () => Currency.jiaozi.value,
    formatValue: x => format(x, 2, 1),
    formatClass: "o-sidebar-currency--jiaozi",
  },
  {
    id: 3,
    optionName: "scs",
    isAvailable: () => PlayerProgress.steamerUnlocked(),
    value: () => Currency.steamerCoins.value,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--steamer-coins",
  },
  {
    id: 4,
    optionName: "cores",
    isAvailable: () => PlayerProgress.simulationUnlocked(),
    value: () => Currency.cores.value,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--cores",
  },
];
