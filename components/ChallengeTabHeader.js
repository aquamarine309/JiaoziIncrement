import PrimaryButton from "./PrimaryButton.js";
import PrimaryToggleButton from "./PrimaryToggleButton.js";

export default {
  name: "ChallengeTabHeader",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      retryChallenge: false,
      isInChallenge: false,
      isShowAllVisible: false,
      updateCollectionSetAfterChallenge: false
    };
  },
  watch: {
    retryChallenge(newValue) {
      player.options.retryChallenge = newValue;
    },
    showAllChallenges(newValue) {
      player.options.showAllChallenges = newValue;
    },
    updateCollectionSetAfterChallenge(newValue) {
      player.options.updateCollectionSetAfterChallenge = newValue;
    }
  },
  methods: {
    update() {
      this.retryChallenge = player.options.retryChallenge;
      this.showAllChallenges = player.options.showAllChallenges;
      this.isInChallenge = Player.isInAnyChallenge;
      this.updateCollectionSetAfterChallenge = player.options.updateCollectionSetAfterChallenge;
    },
    restartChallenge() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit();
        current.start();
      }
    },
    exitChallenge() {
      const current = Player.normalChallenge;
      if (Player.isInAnyChallenge) {
        current.exit();
      }
    }
  },
  template: `
  <div class="l-challenges-tab__header">
    <div class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="retryChallenge"
        class="o-primary-btn--subtab-option"
        :label="$t('autoRetryChall')"
      />
      <PrimaryToggleButton
        v-if="isShowAllVisible"
        v-model="showAllChallenges"
        class="o-primary-btn--subtab-option"
        :label="$t('showKnownChall')"
      />
      <PrimaryButton
        v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="restartChallenge"
      >
        {{ $t("restart") }}
      </PrimaryButton>
      <PrimaryButton
        v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="exitChallenge"
      >
        {{ $t("exit") }}
      </PrimaryButton>
      <PrimaryToggleButton
        class="o-primary-btn--subtab-option"
        v-model="updateCollectionSetAfterChallenge"
        :label="$t('updateCollectionSetAfterChallenge')"
      />
    </div>
  </div>
  `
}