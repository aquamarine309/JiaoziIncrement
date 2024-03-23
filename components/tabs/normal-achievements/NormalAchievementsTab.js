import NormalAchievementRow from "./NormalAchievementRow.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "NormalAchievementsTab",
  components: {
    NormalAchievementRow,
    PrimaryToggleButton
  },
  data() {
    return {
      achievementPower: 0,
      achCountdown: 0,
      totalCountdown: 0,
      missingAchievements: 0,
      showAutoAchieve: false,
      isAutoAchieveActive: false,
      hideCompletedRows: false,
      achMultBreak: false,
      renderedRowIndices: []
    };
  },
  computed: {
    rows: () => Achievements.allRows,
    renderedRows() {
      return this.rows.filter((_, i) => this.renderedRowIndices.includes(i));
    },
    boostText() {
      const achievementPower = formatX(this.achievementPower, 2, 3);
      return `${$t("makers")}: ${achievementPower}`;
    },
    isEnglish() {
      return this.$viewModel.language === "en";
    }
  },
  watch: {
    hideCompletedRows(newValue) {
      player.options.hideCompletedAchievementRows = newValue;
      this.startRowRendering();
    }
  },
  created() {
    this.startRowRendering();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
  },
  methods: {
    update() {
      this.achievementPower = Achievements.power;
      this.hideCompletedRows = player.options.hideCompletedAchievementRows;
    },
    startRowRendering() {
      const unlockedRows = [];
      const lockedRows = [];
      for (let i = 0; i < this.rows.length; i++) {
        const targetArray = this.rows[i].every(a => a.isUnlocked) ? unlockedRows : lockedRows;
        targetArray.push(i);
      }
      const renderedLockedRows = lockedRows.filter(row => this.renderedRowIndices.includes(row));
      const nonRenderedLockedRows = lockedRows.filter(row => !this.renderedRowIndices.includes(row));
      let rowsToRender;
      if (player.options.hideCompletedAchievementRows) {
        this.renderedRowIndices = unlockedRows.concat(renderedLockedRows);
        rowsToRender = nonRenderedLockedRows;
      } else {
        this.renderedRowIndices = renderedLockedRows;
        rowsToRender = unlockedRows.concat(nonRenderedLockedRows);
      }
      const stepThroughRendering = () => {
        const ROWS_PER_FRAME = 2;
        for (let i = 0; i < ROWS_PER_FRAME; i++) {
          if (rowsToRender.length === 0) {
            return;
          }
          this.renderedRowIndices.push(rowsToRender.shift());
        }
        this.renderAnimationId = requestAnimationFrame(stepThroughRendering);
      };
      stepThroughRendering();
    },
    isRendered(row) {
      return this.renderedRowIndices.includes(row);
    },
    timeDisplay,
    timeDisplayNoDecimals,
  },
  template: `
  <div class="l-achievements-tab">
    <div class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="hideCompletedRows"
        class="o-primary-btn--subtab-option"
        :label="$t('hideCompletedRows')"
      />
      <PrimaryToggleButton
        v-if="showAutoAchieve"
        v-model="isAutoAchieveActive"
        class="o-primary-btn--subtab-option"
        :label="$t('autoAchieve')"
      />
    </div>
    <div class="c-achievements-tab__header c-achievements-tab__header--multipliers">
      <span>
        {{ $t("achievementsBoost") }}
        <div v-html="boostText" />
      </span>
    </div>
    <div class="c-achievements-tab__header">
      <template v-if="isEnglish">
        Achievements with a <i class="fas fa-star-of-david" /> icon also give an additional reward.
      </template>
      
      <template v-else>
        带 <i class="fas fa-star-of-david" /> 符号背景的成就同时会提供特殊的奖励。
      </template>
    </div>
    <div
      v-if="showAutoAchieve"
      class="c-achievements-tab__header"
    >
      <div v-if="achCountdown > 0">
        Automatically gain the next missing Achievement in
        {{ timeDisplayNoDecimals(achCountdown) }}<span v-if="!isAutoAchieveActive"> once Auto is turned on</span>.
        (left-to-right, top-to-bottom)
      </div>
      <div v-else-if="missingAchievements !== 0">
        Automatically gain the next missing Achievement as soon as you enable Auto Achievements.
        (left-to-right, top-to-bottom)
      </div>
      <div v-if="totalCountdown > 0">
        You will regain all remaining achievements after {{ timeDisplayNoDecimals(totalCountdown) }} if Auto
        Achievement <span v-if="isAutoAchieveActive">stays enabled</span><span v-else>is turned on</span>.
      </div>
      <br>
    </div>
    <div class="l-achievement-grid">
      <NormalAchievementRow
        v-for="(row, i) in renderedRows"
        :key="i"
        :row="row"
      />
    </div>
  </div>
  `
}