import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "AutobuyerToggles",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      autobuyersOn: false,
      allAutobuyersDisabled: false
    };
  },
  watch: {
    autobuyersOn(newValue) {
      if (NormalChallenge(3).isRunning) return
      player.auto.autobuyersOn = newValue;
    }
  },
  methods: {
    update() {
      this.autobuyersOn = player.auto.autobuyersOn;
      this.allAutobuyersDisabled = Autobuyers.unlocked.every(autobuyer => !autobuyer.isActive);
    },
    toggleAllAutobuyers() {
      for (const autobuyer of Autobuyers.unlocked) {
        autobuyer.isActive = this.allAutobuyersDisabled;
      }
    }
  },
  template: `
  <div class="c-subtab-option-container">
    <PrimaryToggleButton
      v-model="autobuyersOn"
      on="pauseAutobuyers"
      off="resumeAutobuyers"
      class="o-primary-btn--subtab-option"
    />
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="toggleAllAutobuyers()"
    >
      {{ allAutobuyersDisabled ? $t("enable") : $t("disable") }}{{ $t("scape") }}{{ $t("allAutos") }}
    </PrimaryButton>
  </div>
  `
}