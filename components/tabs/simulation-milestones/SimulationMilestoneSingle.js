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
    }
  },
  data() {
    return {
      cores: new Decimal(0),
      isReached: false,
      percents: 0
    }
  },
  methods: {
    update() {
      const milestone = this.milestone;
      this.cores = Decimal.min(Currency.cores.value, this.requirement);
      this.isReached = milestone.isReached;
      this.percents = Decimal.min(this.cores.div(this.requirement), 1).toNumber();
    }
  },
  computed: {
    id() {
      return this.milestone.id + 1;
    },
    requirement() {
      return this.milestone.cores
    },
    progressBarClass() {
      return {
        "o-milestone-progress-bar": true,
        "o-milestone-progress-bar--reached": this.reached
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
      return `${$t("reward")}:`
    }
  },
  template: `
    <div class="o-simulation-milestone-container">
      <h2>{{ $t("milestone") }} {{ formatInt(id) }}</h2>
      <div
        :class="progressBarClass"
      >
        <div class="o-milestone-progress-bar--text">
          {{ formatInt(cores) }}/{{ formatInt(requirement) }} {{ $t("cores") }}
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
      <EffectDisplay :config="config" br />
    </div>
  `
}