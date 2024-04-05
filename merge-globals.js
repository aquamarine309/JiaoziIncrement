/* eslint-disable import/newline-after-import, import/first, import/order */
function mergeIntoGlobal(object) {
  for (const key in object) {
    if (key === "default") {
      // Skip default exports
      continue;
    }
    const value = object[key];
    const existingValue = window[key];
    if (existingValue !== undefined) {
      throw `Property ${key} already exists in global context`;
    }

    window[key] = value;
  }
}

import * as Utils from "./core/utils.js";
mergeIntoGlobal(Utils);

import * as GameDB from "./core/secret-formula/index.js";
mergeIntoGlobal(GameDB);

import * as core from './core/globals.js';
mergeIntoGlobal(core);

import * as game from "./game.js";
mergeIntoGlobal(game);
