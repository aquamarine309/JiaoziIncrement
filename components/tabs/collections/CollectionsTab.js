import CollectionGrid from './CollectionGrid.js';
import CollectionPresetSingle from "./CollectionPresetSingle.js";

export default {
  name: 'CollectionsTab',
  components: {
    CollectionGrid,
    CollectionPresetSingle
  },
  data() {
    return {
      collectedCount: 0,
      needReset: false,
      activeAmount: 0,
      maxActiveAmount: 0,
      steamer: false,
      presets: [],
      showPresets: false,
      amplificationUnlocked: false,
      amplificationPoints: 0,
      totalAmplificationPoints: 0
    }
  },
  methods: {
    update() {
      this.collectedCount = this.collections.countWhere(v => v.isUnlocked);
      this.needReset = player.needResetCols;
      this.activeAmount = Collections.activeAmount;
      this.maxActiveAmount = Collections.maxActiveAmount;
      this.steamer = PlayerProgress.steamerUnlocked();
      this.showPresets = PlayerProgress.simulationUnlocked();
      this.amplificationUnlocked = Collections.isAmplificationUnlocked;
      this.totalAmplificationPoints = Currency.amplificationPoints.value;
      this.amplificationPoints = Collections.amplificationPointsLeft;
    },
    reset() {
      player.needResetCols = !player.needResetCols;
    },
    updatePresets() {
      this.presets = CollectionPresets.all.concat([undefined]);
    }
  },
  created() {
    this.on$(GAME_EVENT.UPDATE_COLLECTION_PRESETS_AFTER, this.updatePresets);
    if (GameUI.initialized) {
      this.updatePresets();
    }
  },
  computed: {
    collections() {
      return Collections.all;
    },
    btnStyle() {
      return {
        'o-col-reset-btn': true,
        'o-col-reset-btn--active': this.needReset
      }
    },
    inf() {
      return quantify($t("jiaozi"), Number.MAX_VALUE, 2, 0, formatPostBreak);
    }
  },
  template: `
    <div>
      <h1 class='o-collection-title'>
        {{ $t("collections") }}
        ({{ formatInt(collectedCount) }} / {{ formatInt(collections.length) }})
      </h1>
      <p>
        {{ $t("collInfo", [quantifyInt($t("collection"), maxActiveAmount), formatInt(activeAmount)]) }}
      </p>
      <p v-if="amplificationUnlocked">你有 <span class="c-amplification-points-amount">{{ formatInt(amplificationPoints) }}</span> 个增幅点数 (共有 {{ formatInt(totalAmplificationPoints) }} 个)</p>
      <p v-if="!steamer">
        {{ $t("collSteamerTip", [inf]) }}
      </p>
      <div
      @click='reset'
      :class='btnStyle'
      >
        {{ $t("deactivateInfo") }}
      </div>
      <div
      class="c-collection-presets-container"
      v-if="showPresets"
      >
        <div class='l-collection-presets-row'
        v-for='row in Math.ceil(presets.length / 2)'
        :key='row'
        >
          <CollectionPresetSingle
          v-for='column in 2'
          :key='column'
          v-if='(row - 1) * 2 + column <= presets.length'
          :preset="presets[(row - 1) * 2 + column - 1]"
          />
        </div>
      </div>
      <div class='o-collection-container'>
        <div class='o-collection-row'
        v-for='row in Math.ceil(collections.length / 3)'
        :key='row'
        >
          <CollectionGrid
          v-for='column in 3'
          :key='column'
          v-if='(row - 1) * 3 + column <= collections.length'
          :collection='collections[(row - 1) * 3 + column - 1]'
          />
        </div>
      </div>
    </div>
  `
}