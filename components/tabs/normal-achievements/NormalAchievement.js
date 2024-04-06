import wordShift from "../../../core/word-shift.js";

import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "NormalAchievement",
  components: {
    EffectDisplay
  },
  props: {
    achievement: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isDisabled: false,
      isUnlocked: false,
      isMouseOver: false,
      showUnlockState: false,
      achievementTime: 0,
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    displayId() {
      return this.config.displayId ?? this.id;
    },
    name() {
      return this.achievement.name;
    },
    description() {
      return this.config.description;
    },
    config() {
      return this.achievement.config;
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--disabled": this.isDisabled,
        "o-achievement--locked": !this.isUnlocked && !this.isDisabled,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--waiting": !this.isUnlocked && !this.isDisabled && false,
        "o-achievement--normal": !this.isCancer,
        "o-achievement--cancer": this.isCancer
      };
    },
    indicatorIconClass() {
      if (this.isUnlocked) return "fas fa-check";
      if (!this.isDisabled) return "far fa-clock";
      return "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--disabled": this.isDisabled,
        "o-achievement__indicator--locked": !this.isUnlocked && !this.isDisabled
      };
    },
    rewardClassObject() {
      return {
        "o-achievement__reward": true,
        "o-achievement__reward--disabled": this.isDisabled,
        "o-achievement__reward--locked": !this.isUnlocked && !this.isDisabled
      };
    },
    hasReward() {
      return this.config.reward !== undefined;
    },
    achievedTime() {
      return null
      if (this.achievementTime === undefined) return "Not Achieved yet";
      return this.achievementTime === 0 ?
        "Given at Speedrun start" :
        `Achieved after ${TimeSpan.fromMilliseconds(this.achievementTime).toStringShort()}`;
    }
  },
  beforeDestroy() {
    clearTimeout(this.mouseOverInterval);
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked && !this.isDisabled;
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 300);
    }
  },
  template: `
  <div
    :class="classObject"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="o-achievement__tooltip">
      <template v-if="isMouseOver">
        <div class="o-achievement__tooltip__name">
          {{ name }} ({{ displayId }})
        </div>
        <div class="o-achievement__tooltip__description">
          {{ description }}
        </div>
        <div
          v-if="config.reward"
          class="o-achievement__tooltip__reward"
        >
          <span
            :class="{ 'o-pelle-disabled': isDisabled }"
          >
            {{ $t("reward") }}: {{ config.reward }}
            <EffectDisplay
              v-if="config.formatEffect"
              br
              :config="config"
            />
          </span>
        </div>
        <div
          v-if="achievedTime"
          class="o-achievement-time"
        >
          {{ achievedTime }}
        </div>
      </template>
    </div>
    <div class='o-achievement-star'>
      <i
        class="fas fa-star-of-david o-star-big"
        v-if='hasReward'
      />
      <i
        v-else
        class='fa fa-cogs o-star-small'
      />
    </div>
    </div>
  </div>
  `
}