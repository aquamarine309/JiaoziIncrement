import { tabs } from "./tabs.js";
import { sidebarResources } from "./sidebar-resources.js";
import { collections } from './collections.js';
import { confirmationTypes } from "./confirmation-types.js";
import { steamer } from "./steamer/index.js";
import { h2p } from "./h2p.js";
import { challenges } from "./challenges/index.js";
import { awayProgressTypes } from "./away-progress-types.js";
import { tabNotifications } from "./tab-notifications.js";
import { achievements } from "./achievements/index.js";
import { languages } from "./languages.js";
import { simulation } from "./simulation/index.js";

export const GameDatabase = {
  tabs,
  sidebarResources,
  collections,
  confirmationTypes,
  steamer,
  h2p,
  challenges,
  awayProgressTypes,
  tabNotifications,
  achievements,
  languages,
  simulation
};

window.GameDatabase = GameDatabase;

window.mapGameData = function mapGameData(gameData, mapFn) {
  const result = [];
  for (const data of gameData) {
    result[data.id] = mapFn(data);
  }
  return result;
};

window.mapGameDataToObject = function mapGameDataToObject(gameData, mapFun) {
  const array = Object.entries(gameData);
  const out = {};
  for (let idx = 0; idx < array.length; idx++) {
    out[array[idx][0]] = mapFun(array[idx][1]);
  }
  return {
    all: Object.values(out),
    ...out
  };
};
