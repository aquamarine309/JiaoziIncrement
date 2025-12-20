const PLACEHOLDER_REGEX = /\$(\d+)/g;

class LanguageState {
  constructor(config) {
    this.name = config.name;
    this.formattedName = config.formattedName;
    this._resources = config.resources;
    this._cache = new Map();
    
    const resources = {};
    for (let key in this._resources) {
      resources[key] = values => {
        if (!values || values.length === 0) {
          return this._resources[key];
        }
        const cacheKey = `${key}:${values.join('|')}`;
        if (this._cache.has(cacheKey)) {
          return this._cache.get(cacheKey);
        }
        
        const result = this.format(key, values);
        this._cache.set(cacheKey, result);
        return result;
      };
    }
    this.resources = resources;
  }

  format(key, values) {
    const result = this._resources[key];
    if (!values) return result;
    return result.replace(PLACEHOLDER_REGEX, (match, index) => {
      const idx = parseInt(index, 10) - 1;
      return values[idx] !== undefined ? values[idx] : match;
    });
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
  _currentCache: null,
  _currentName: null,

  find(name) {
    if (this._currentCache && this._currentName === name) {
      return this._currentCache;
    }
    
    const language = this.all.find(l => l.name === name);
    const result = language === undefined ? this.base : language;
    this._currentCache = result;
    this._currentName = name;
    
    return result;
  },
  
  get current() {
    if (!GameUI.initialized) return this.base;
    
    return ui.language;
  },
  
  toggle() {
    const index = this.all.findIndex(l => l === this.current);
    this.all[(index + 1) % this.all.length].setAsCurrent();
    this._currentCache = null;
    this._currentName = null;
    GameUI.update();
    
    GameStorage.save();
  }
};