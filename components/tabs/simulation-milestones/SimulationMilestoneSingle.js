import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "SimulationMilestoneSingle",
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    milestone: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      cores: new Decimal(0),
      isReached: false,
      percents: 0,
      isUnlocked: false
    }
  },
  methods: {
    update() {
      const milestone = this.milestone;
      this.isUnlocked = milestone.isUnlocked;
      if (!this.isUnlocked) return;
      this.cores = Decimal.min(Currency.cores.value, this.requirement);
      this.isReached = milestone.isReached;
      this.percents = Decimal.min(this.cores.div(this.requirement), 1).toNumber();
    }
  },
  computed: {
    requirement() {
      return this.milestone.cores;
    },
    progressBarClass() {
      return {
        "o-milestone-progress-bar": true,
        "o-milestone-progress-bar--reached": this.isReached
      }
    },
    progressBarStyle() {
      return {
        width: `${this.percents * 100}%`
      }
    },
    config() {
      return this.milestone.config;
    },
    descriptionTitle() {
      return $t("reward_");
    },
    info() {
      if (this.isReached) {
        return $t("reached");
      }
      return formatPercents(this.percents, 3);
    },
    key() {
      return this.milestone.config.key;
    }
  },
  template: `
    <div
      class="o-simulation-milestone-container"
      v-if="isUnlocked"
    >
      <h2>{{ key }}</h2>
      <div :class="progressBarClass">
        <div class="o-milestone-progress-bar--text">
          {{ format(cores, 2) }}/{{ format(requirement, 2) }} {{ $t("cores") }} ({{ info }})
        </div>
        <div
          class="o-milestone-progress-bar--filling"
          :style="progressBarStyle"
        />
      </div>
      <DescriptionDisplay
        :config="config"
        :title="descriptionTitle"
      />
      <EffectDisplay :config="config" />
    </div>
  `
}