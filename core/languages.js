class LanguageState {
  constructor(config) {
    this.name = config.name;
    this.formattedName = config.formattedName
    this._resources = config.resources;
    const resources = {};
    for (let key in this._resources) {
      resources[key] = values => this.format(key, values);
    }
    this.resources = resources;
  }

  format(key, values) {
    const result = this._resources[key];
    if (!values) return result;
    return result.replace(/\$(\d+)/g, function (match, index) {
      return values[parseInt(index) - 1];
    })
  }

  setAsCurrent() {
    player.options.language = this.name;
    ui.view.language = this.name;
  }
}

export const Language = mapGameDataToObject(GameDatabase.languages, config => new LanguageState(config));

export const Languages = {
  all: Language.all,

  base: navigator.language === "zh-CN" ? Language["zh-CN"] : Language["en"],

  find(name) {
    const language = Languages.all.find(l => l.name === name);
    return language === undefined ? this.base : language;
  },
  get current() {
    return GameUI.initialized ? ui.language : this.base;
  },
  toggle() {
    const index = this.all.findIndex(l => l === this.current);
    this.all[(index + 1) % this.all.length].setAsCurrent();
    GameStorage.save();
  }
}
