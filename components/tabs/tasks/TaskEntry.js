import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "TaskEntry",
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  components: {
    DescriptionDisplay,
    EffectDisplay,
    PrimaryToggleButton
  },
  data() {
    return {
      percents: 0,
      condition: false,
      isAuto: false,
      autoUnlocked: false
    }
  },
  watch: {
    isAuto(newValue) {
      Autobuyer.task(this.task.id).isActive = newValue;
    }
  },
  computed: {
    config() {
      return this.task.config
    },
    reward() {
      return this.task.reward.config
    },
    title() {
      return `${$t("takeaway")}${$t("scape")}${this.config.id}:`
    },
    btnStyle() {
      return {
        "o-task-btn": true,
        "o-task-btn--disabled": this.percents < 1 || !this.condition
      }
    },
    barStyle() {
      return {
        width: `${this.percents * 100}%`
      }
    },
    barClass() {
      return {
        "o-task-bar-fill": true,
        "o-task-bar-fill--bad": !this.condition
      }
    }
  },
  methods: {
    update() {
      this.percents = this.task.percents;
      this.condition = this.task.condition;
      this.isAuto = Autobuyer.task(this.task.id).isActive;
      this.autoUnlocked = SimulationMilestone.qols.isReached;
    },
    complete() {
      this.task.complete();
    }
  },
  template: `
  <div class="o-task-container">
    <div class="o-task-info">
      <div class="o-task-description">
        <DescriptionDisplay
        :config="config"
        :title="title"
        />
      </div>
      <div class="o-task-reward">
        <DescriptionDisplay
        :config="reward"
        :title="$t('reward_')"
        />
      </div>
      <div class="o-task-reward">
        <EffectDisplay
        :config="reward"
        />
      </div>
      <div class="o-task-bar-container">
        <div class="o-task-percents">
          <div
          :class="barClass"
          :style="barStyle"
          />
        </div>
        <div class="o-task-text">{{ formatPercents(percents, 2, 2) }}</div>
      </div>
    </div>
    <div class="o-task-btn-container">
      <button
      :class="btnStyle"
      @click="complete"
      >
        {{ $t("complete") }}
      </button>
      <PrimaryToggleButton
      class="c-task-auto-btn"
      v-model="isAuto"
      :label="$t('auto_')"
      v-if="autoUnlocked"
      />
    </div>
  </div>
  `
}