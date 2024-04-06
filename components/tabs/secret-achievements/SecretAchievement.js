export default {
  name: "SecretAchievement",
  props: {
    achievement: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isMouseOver: false,
      showUnlockState: false
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    config() {
      return this.achievement.config;
    },
    name() {
      return this.achievement.name;
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--hidden": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--secret": true
      };
    },
    indicatorIconClass() {
      return this.isUnlocked ? "fas fa-check" : "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--locked": !this.isUnlocked
      };
    },
  },
  beforeDestroy() {
    clearTimeout(this.mouseOverInterval);
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 300);
    },
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
          {{ name }} (S{{ id }})
        </div>
        <div
          v-if="isUnlocked"
          class="o-achievement__tooltip__description"
        >
          {{ config.description() }}
        </div>
      </template>
    </div>
    <div
      class='o-achievement-star'
      v-if="isUnlocked"
    >
      <i class='fa fa-cogs o-star-small' />
    </div>
  </div>
  `
}