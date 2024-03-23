import { DC } from "../constants.js";

export const tabNotifications = {
  firstBigReset: {
    id: 0,
    tabsToHighLight: [
      {
        parent: "collections",
        tab: "collections"
      }
    ],
    condition: () => !PlayerProgress.collectionUnlocked(),
    events: [GAME_EVENT.BIG_RESET_BEFORE]
  },
  breakInf: {
    id: 1,
    tabsToHighLight: [
      {
        parent: "challenges",
        tab: "normal"
      }
    ],
    condition: () => !PlayerProgress.hasBroken(),
    events: [GAME_EVENT.BREAK_INFINITY]
  },
  newAutobuyer: {
    id: 2,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "autobuyers"
      },
    ],
    condition: () => true,
  }
};
