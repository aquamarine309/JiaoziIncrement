import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      totalJiaozi: new Decimal(0),
      realTimePlayed: TimeSpan.zero,
      timeSinceCreation: 0,
      bigReset: {
        isUnlocked: false,
        count: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      steamer: {
        isUnlocked: false,
        count: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0)
      },
      simulation: {
        isUnlocked: false,
        count: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0)
      },
      paperclips: 0,
      fullTimePlayed: 0,
      buyMakerMult: new Decimal(0)
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    bigResetCountString() {
      const num = this.bigReset.count;
      return num.gt(0) ?
        $t("bigResetCountStat", [quantify($t("bigResetCount"), num, 0, 0, this.formatDecimalAmount), "次"]) :
        $t("noBigResetCountStat");
    },
    steamerCountString() {
      const num = this.steamer.count;
      return num.gt(0) ?
        $t("steamerCountStat", [quantify($t("steamerCount"), num, 0, 0, this.formatDecimalAmount, "次")]) :
        $t("noSteamerCountStat");
    },
    concludesString() {
      const num = this.simulation.count;
      return num.gt(0) ?
        $t("concludesStat", [quantify($t("simulation"), num, 0, 0, this.formatDecimalAmount, "次")]) :
        $t("noConcludesStat");
    },
    fullGameCompletions() {
      return player.records.fullGameCompletions;
    },
    startDate() {
      return Time.toDateTimeString(player.records.gameCreatedTime);
    },
    saveAge() {
      return TimeSpan.fromMilliseconds(this.timeSinceCreation);
    },
  },
  methods: {
    update() {
      const records = player.records;
      this.totalJiaozi.copyFrom(records.totalJiaozi);
      this.realTimePlayed.setFrom(records.realTimePlayed);
      this.fullTimePlayed = TimeSpan.fromMilliseconds(records.previousRunRealTime + records.realTimePlayed);
      this.timeSinceCreation = Date.now() - player.records.gameCreatedTime;
      this.buyMakerMult = Makers.buyOneMultiplier;

      const progress = PlayerProgress.current;
      
      const isCollectionUnlocked = progress.isCollectionUnlocked;
      const bigReset = this.bigReset;
      const bestBigReset = records.bestBigReset;
      bigReset.isUnlocked = isCollectionUnlocked;
      if (isCollectionUnlocked) {
        bigReset.count.copyFrom(Currency.bigResetCount);
        bigReset.hasBest = bestBigReset.time < 999999999999;
        bigReset.best.setFrom(bestBigReset.time);
        bigReset.this.setFrom(records.thisBigReset.time);
      }

      const isSteamerUnlocked = progress.isSteamerUnlocked;
      const steamer = this.steamer;
      const bestSteamer = records.bestSteamer;
      steamer.isUnlocked = isSteamerUnlocked;
      if (isSteamerUnlocked) {
        steamer.count.copyFrom(Currency.steamerCount);
        steamer.hasBest = bestSteamer.time < 999999999999;
        steamer.best.setFrom(bestSteamer.time);
        steamer.this.setFrom(records.thisSteamer.time);
      }
      
      const isSimulationUnlocked = progress.isSimulationUnlocked;
      const simulation = this.simulation;
      const bestSimulation = records.bestSimulation;
      simulation.isUnlocked = isSimulationUnlocked;
      if (isSimulationUnlocked) {
        simulation.count.copyFrom(Currency.simulations);
        simulation.hasBest = bestSimulation.time < 999999999999;
        simulation.best.setFrom(bestSimulation.time);
        simulation.this.setFrom(records.thisSimulation.time);
      }
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3) : formatInt(Math.floor(value.toNumber()));
    }
  },
  template: `
  <div class="c-stats-tab">
    <div>
      <PrimaryButton onclick="Modal.catchup.show(0)">
        {{ $t("openCatchup") }}
      </PrimaryButton>
      <div class="c-stats-tab-title c-stats-tab-general">
        {{ $t("general") }}
      </div>
      <div class="c-stats-tab-general">
        <div>{{ $t("totalJiaozi", [quantify($t("jiaozi"), totalJiaozi, 2, 1)]) }}</div>
        <div>{{ $t("totalRealTime", [realTimePlayed]) }}</div>
        <div>
          {{ $t("saveCreatedStat", [startDate, saveAge]) }}
        </div>
        <div>
          {{ $t("buyMakerMult", [formatX(buyMakerMult, 2, 3)]) }}
        </div>
      </div>
      <br>
    </div>
    <div
      v-if="bigReset.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-big-reset">
        {{ $t("coll") }}
      </div>
      <div>
        {{ bigResetCountString }}
      </div>
      <div v-if="bigReset.hasBest">
        {{ $t("fastestCollReset", [bigReset.best.toStringShort()]) }}
      </div>
      <div v-else>
        {{ $t("noFastestCollReset") }}
      </div>
      <div>
        {{ $t("thisCollTime", [bigReset.this.toStringShort()]) }}
      </div>
      <br>
    </div>
    <div
      v-if="steamer.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-steamer">
        {{ $t("steamer") }}
      </div>
      <div>
        {{ steamerCountString }}
      </div>
      <div v-if="steamer.hasBest">
        {{ $t("fastestSteamerReset", [steamer.best.toStringShort()]) }}
      </div>
      <div v-else>
        {{ $t("noFastestSteamerReset") }}
      </div>
      <div>
        {{ $t("thisSteamerTime", [steamer.this.toStringShort()]) }}
      </div>
      <br>
    </div>
    <div
      v-if="simulation.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-simulation">
        {{ $t("simulation") }}
      </div>
      <div>
        {{ concludesString }}
      </div>
      <div v-if="simulation.hasBest">
        {{ $t("fastestSimulationReset", [simulation.best.toStringShort()]) }}
      </div>
      <div v-else>
        {{ $t("noFastestSimulationReset") }}
      </div>
      <div>
        {{ $t("thisSimulationTime", [simulation.this.toStringShort()]) }}
      </div>
      <br>
    </div>
  </div>
  `
}