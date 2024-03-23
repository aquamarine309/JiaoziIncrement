import ChallengeBox from "../../ChallengeBox.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import CollectionSetPreview from "../../CollectionSetPreview.js";

export
default {
  name: "NormalChallengeBox",
  components: {
    ChallengeBox,
    DescriptionDisplay,
    EffectDisplay,
    CollectionSetPreview
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      isCompleted: false
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    name() {
      return `${$t("nc")} ${this.challenge.id}`;
    }
  },
  methods: {
    update() {
      const challenge = this.challenge;
      this.isRunning = challenge.isRunning;
      this.isCompleted = challenge.isCompleted;
      this.isUnlocked = challenge.isUnlocked;
    }
  },
  template: `
  <ChallengeBox
    :name="name"
    :is-running="isRunning"
    :is-unlocked="isUnlocked"
    :is-completed="isCompleted"
    class="c-challenge-box--normal"
    @start="challenge.requestStart()"
  >
    <template #top>
      <DescriptionDisplay :config="config" />
      <EffectDisplay
        v-if="isRunning"
        :config="config"
      />
    </template>
    <template #bottom>
      <div class="l-challenge-box__bottom--normal">
        <DescriptionDisplay
          :config="config.reward"
          :title="$t('reward_')"
        />
        <EffectDisplay
          v-if="isCompleted"
          :config="config.reward"
        />
      </div>
      <CollectionSetPreview :activeBits="challenge.activeBits" />
    </template>
  </ChallengeBox>
  `
}