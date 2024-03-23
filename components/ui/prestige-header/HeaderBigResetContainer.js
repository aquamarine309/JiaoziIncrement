export default {
  name: "HeaderBigResetContainer",
  data() {
    return {
      showContainer: false,
      canBigReset: false,
      colAmount: 0,
      gainedCols: 0,
      showColRate: false,
      currentColRate: 0,
      peakColRate: 0,
      peakColRateVal: new Decimal(0),
      inChallenge: false,
      canSteamer: false,
      showBtn: false,
      hover: false,
      headerTextColored: false
    };
  },
  methods: {
    update() {
      this.showContainer = SteamerUpgrade.resetRequirement.isBought || PlayerProgress.simulationUnlocked();
      this.showBtn = SteamerUpgrade.resetRequirement.isBought;
      this.canBigReset = Stuffing.bigResetCheck;
      this.colAmount = player.totalColls;
      const _gainedCols = gainedCols();
      this.gainedCols = _gainedCols;
      this.currentColRate = _gainedCols / Math.clampMin(0.0005, Time.thisBigResetRealTime.totalMinutes);
      this.peakColRate = player.records.thisBigReset.bestColMin;
      this.peakColRateVal = player.records.thisBigReset.bestColMinValue
      this.showColRate = this.peakColRate < this.rateThreshold;
      this.headerTextColored = player.options.headerTextColored;
      this.inChallenge = Player.isInNormalChallenge;
      this.canSteamer = !player.
      break && Player.canFixSteamer;
    },
    bigReset() {
      requestBigReset()
    }
  },
  computed: {
    rateThreshold: () => 1e15,
    amountStyle() {
      if (!this.headerTextColored || this.colAmount < this.rateThreshold) return {
        "transition-duration": "0s"
      };
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };

      // Dynamically generate red-text-green based on the CSS entry for text color, returning a raw 6-digit hex color
      // code. stepRGB is an array specifying the three RGB codes, which are then interpolated between in order to
      // generate the final color; only ratios between 0.9-1.1 give a color gradient
      const textHexCode = getComputedStyle(document.body)
        .getPropertyValue("--color-text")
        .split("#")[1];
      const stepRGB = [
        [255, 0, 0],
        [
        parseInt(textHexCode.substring(0, 2), 16),
        parseInt(textHexCode.substring(2, 4), 16),
        parseInt(textHexCode.substring(4), 16)],
        [0, 255, 0]
      ];
      const ratio = Math.log(this.gainedCols) / Math.log(this.colAmount);
      const interFn = index => {
        if (ratio < 0.9) return stepRGB[0][index];
        if (ratio < 1) {
          const r = 10 * (ratio - 0.9);
          return Math.round(stepRGB[0][index] * (1 - r) + stepRGB[1][index] * r);
        }
        if (ratio < 1.1) {
          const r = 10 * (ratio - 1);
          return Math.round(stepRGB[1][index] * (1 - r) + stepRGB[2][index] * r);
        }
        return stepRGB[2][index];
      };
      const rgb = [interFn(0), interFn(1), interFn(2)];
      return {
        color: `rgb(${rgb.join(",")})`,
        "transition-duration": "0.2s"
      };
    },
    buttonClassObject() {
      return {
        "o-prestige-button": true,
        "o-big-reset-button": true,
        "o-big-reset-button--unavailable": !this.canBigReset
      }
    },
    goal() {
      return 1e50
    }
  },
  template: `
  <div
    v-if="showContainer"
    class="c-prestige-button-container"
  >
    <div class="c-big-reset-count">
      {{ $t("youHave") }}
      <span class="c-game-header__brc-amount">{{ format(colAmount, 2) }}</span>
      {{ pluralize($t("collection"), colAmount) }}
    </div>
    <button
      v-if="showBtn"
      :class="buttonClassObject"
      class="o-prestige-button o-big-reset-button"
      @click="bigReset"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @touchstart="hover = true"
      @touchend="hover = false"
    >
      <!-- Can Fix Steamer -->
      <template v-if="canSteamer">
        {{ $t("brokenSteamer") }}
        <br>
        {{ $t("cannotCollectionReset") }}
      </template>
      
      <!-- Cannot Reset -->
      <template v-else-if="!canBigReset">
        {{ $t("reach") }} {{ format(goal, 2, 2) }}
        <br>
        {{ pluralize($t("money"), goal) }}
      </template>
      
      <!-- Can Steamer in challenge -->
      <template v-else-if="inChallenge">
        {{ $t("bigResetChall") }}
        <br>
        {{ $t("gainColl") }}
      </template>
      
      <!-- Can Reset -->
      <template v-else>
        <div v-if="!showColRate" />
        <b>
          {{ $t("collToGain") }}
          <span :style="amountStyle">{{ format(gainedCols, 2) }}</span>
          <span>{{ pluralize($t("collection_short"), gainedCols) }}</span>
        </b>
        <template v-if="showColRate">
          <br>
          {{ $t("currentAdj") }}: {{ format(currentColRate, 2) }} {{ $t("collection_short", null, true) }}/{{ $t("min") }}
          <br>
          {{ $t("peak") }}: {{ format(peakColRate, 2) }} {{ $t("collection_short", null, true) }}/{{ $t("min") }}
          <br>
          {{ $t("atPeak", [quantify($t("collection_short"), peakColRateVal, 2)]) }}
        </template>
        <div v-else />
      </template>
    </button>
  </div>
  `
}