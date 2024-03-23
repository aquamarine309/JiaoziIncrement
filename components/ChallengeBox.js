import HintText from "./HintText.js";

export
default {
  name: "ChallengeBox",
  components: {
    HintText
  },
  props: {
    name: {
      type: String,
      required: true
    },
    isUnlocked: {
      type: Boolean,
      required: true
    },
    isRunning: {
      type: Boolean,
      required: true
    },
    isCompleted: {
      type: Boolean,
      required: true
    },
    lockedAt: {
      type: Decimal,
      required: false,
      default: undefined
    },
    overrideLabel: {
      type: String,
      required: false,
      default: "",
    },
  },
  computed: {
    buttonClassObject() {
      const challengeLocked = !(this.isCompleted || this.isRunning || this.isUnlocked);
      // It's important to disable the cursor for Normal Challenge 1, challenges that are running, or
      // for challenges unable to be unlocked and not unlocked.
      const challengeNotEnterable = !this.isUnlocked || this.isRunning;
      return {
        "o-challenge-btn": true,
        "o-challenge-btn--running": this.isRunning,
        "o-challenge-btn--completed": this.isCompleted && this.isUnlocked,
        "o-challenge-btn--unlocked": !this.isCompleted && this.isUnlocked,
        "o-challenge-btn--locked": challengeLocked,
        "o-challenge-btn--unenterable": challengeNotEnterable,
      };
    },
    buttonText() {
      if (this.overrideLabel.length > 0) return this.overrideLabel;
      if (this.isRunning) return $t("running");
      if (this.isCompleted) return $t("completed");
      if (this.isUnlocked) return $t("start");
      return `${$t("locked")}`;
    }
  },
  template: `
  <div class="c-challenge-box l-challenge-box">
    <HintText
      type="challenges"
      class="l-hint-text--challenge"
    >
      {{ name }}
    </HintText>
    <slot name="top" />
    <div class="l-challenge-box__fill" />
    <button
      :class="buttonClassObject"
      @click="$emit('start')"
    >
      {{ buttonText }}
    </button>
    <slot name="bottom" />
  </div>
  `
}