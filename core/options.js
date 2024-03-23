import { sha512_256 } from "../modules/sha512.js";

import FullScreenAnimationHandler from "./full-screen-animation-handler.js";

export class GameOptions {

  static toggleNews() {
    player.options.news.enabled = !player.options.news.enabled;
    ui.view.news = player.options.news.enabled;
    GameStorage.save();
  }

  static toggleLanguage() {
    Languages.toggle()
  }

  static refreshUpdateRate() {
    GameIntervals.gameLoop.restart();
  }

  static refreshAutosaveInterval() {
    GameIntervals.save.restart();
  }
}

const secretImports = [];

function secretImportIndex(data) {
  const sha = sha512_256(data.replace(/\s/gu, "").toUpperCase());
  return secretImports.indexOf(sha);
}

export function isSecretImport(data) {
  return secretImportIndex(data) !== -1;
}

export function tryImportSecret(data) {
  const index = secretImportIndex(data);

  switch (index) {
    default:
      return false;
  }
}
