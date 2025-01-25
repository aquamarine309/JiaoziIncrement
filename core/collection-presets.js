export class CollectionPreset {
  constructor(config) {
    this._config = config;
  }

  get config() {
    return this._config;
  }

  get activeBits() {
    return this.config.activeBits;
  }

  set activeBits(value) {
    this.config.activeBits = value;
  }

  get name() {
    return this.config.name;
  }

  set name(name) {
    this.config.name = name;
  }

  rename(name) {
    this.name = name;
  }

  save() {
    this.import(player.colActiveBits);
  }

  import(bits) {
    this.activeBits = Math.min(511, bits);
  }

  load(slient = true) {
    if (player.colActiveBits > 0) return;
    const collections = []
    for (let i = 0; i < 9 && collections.length <= Collections.maxActiveAmount; i++) {
      if ((this.activeBits & (1 << i)) !== 0) collections.push(Collection[i]);
    }
    collections.forEach(c => c.activate());
  }
}

export const CollectionPresets = {
  get all() {
    return GameCache.collectionPresets.value;
  },
  delete(preset) {
    const index = this.all.indexOf(preset);
    if (index === -1) throw `Unexpected collection preset ${preset.name}.`;
    player.collectionPresets.splice(index, 1);
    this.update();
  },
  add() {
    const presets = player.collectionPresets;
    presets.push({
      name: $t("name"),
      activeBits: 0
    });
    this.update();
  },
  update() {
    GameCache.collectionPresets.invalidate();
    EventHub.ui.dispatch(GAME_EVENT.UPDATE_COLLECTION_PRESETS_AFTER);
  }
}