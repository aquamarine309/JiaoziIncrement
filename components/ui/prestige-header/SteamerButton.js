export default {
  name: "SteamerDimButton",
  data() {
    return {
      isVisible: false,
      canSteamer: false,
      gainedSC: new Decimal(0),
      currentSC: new Decimal(0),
      inChallenge: false,
      showSCRate: false,
      currentSCRate: new Decimal(0),
      peakSCRate: new Decimal(0),
      peakSCRateVal: new Decimal(0),
      hover: false,
      headerTextColored: false
    };
  },
  computed: {
    rateThreshold: () => 1e25,
    amountStyle() {
      if (!this.headerTextColored || this.currentSC.lt(this.rateThreshold)) return {
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
      const ratio = this.gainedSC.log10() / this.currentSC.log10();
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
        "o-steamer-button": true,
        "o-steamer-button--unavailable": !this.canSteamer
      }
    },
    goal() {
      return Number.MAX_VALUE;
    }
  },
  methods: {
    update() {
      this.isVisible = player.break;
      this.headerTextColored = player.options.headerTextColored;
      this.canSteamer = Player.canFixSteamer;
      const gainedSC = gainedSteamerCoins();
      this.gainedSC = gainedSC;
      this.currentSC = Currency.steamerCoins.value;
      this.inChallenge = Player.isInNormalChallenge;
      this.currentSCRate = gainedSC.dividedBy(Math.clampMin(0.0005, Time.thisSteamerRealTime.totalMinutes));
      this.peakSCRate = player.records.thisSteamer.bestSCmin;
      this.peakSCRateVal = player.records.thisSteamer.bestSCminValue;
      this.showSCRate = this.peakSCRate.lte(this.rateThreshold);
    },
    steamer() {
      steamerRequest();
    }
  },
  template: `<button
    v-if="isVisible"
    :class="buttonClassObject"
    class="o-prestige-button o-steamer-button"
    @click="steamer"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Steamer -->
    <template v-if="!canSteamer">
      {{ $t("reach") }} {{ format(goal, 2, 2) }}
      <br>
      {{ pluralize($t("jiaozi"), goal) }}
    </template>

    <!-- Can Steamer in challenge -->
    <template v-else-if="inChallenge">
      {{ $t("steamerTo") }}
      <br>
      {{ $t("completeChall") }}
    </template>

    <!-- Can Steamer -->
    <template v-else>
      <div v-if="!showSCRate" />
      <b>
        {{ $t("steamerToGain") }}
        <span :style="amountStyle">{{ format(gainedSC, 2) }}</span>
        <span v-if="showSCRate">{{ $t("sc_min") }}</span>
        <span v-else>{{ pluralize($t("sc"), gainedSC) }}</span>
      </b>
      <template v-if="showSCRate">
        <br>
        {{ $t("currentAdj") }}: {{ format(currentSCRate, 2) }} {{ $t("sc_min") }}/{{ $t("min") }}
        <br>
        {{ $t("peak") }}: {{ format(peakSCRate, 2) }} {{ $t("sc_min") }}/{{ $t("min") }}
        <br>
        {{ $t("atPeak", [format(peakSCRateVal, 2) + " " + $t("sc_min")]) }}
      </template>
      <div v-else />
    </template>
  </button>
  `
}