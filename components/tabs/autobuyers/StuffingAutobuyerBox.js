import AutobuyerBox from "./AutobuyerBox.js";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton.js";

export default {
  name: "StuffingAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerIntervalButton
  },
  data() {
    return {
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isUnlocked: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.stuffing,
    modeDisplay() {
      switch (this.mode) {
        case AUTOBUYER_MODE.BUY_SINGLE:
          return $t("buysSingles");
        case AUTOBUYER_MODE.BUY_MAX:
          return $t("buysMax");
      }
      throw "Unknown stuffing autobuyer mode";
    }
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
      this.isUnlocked = this.autobuyer.isUnlocked;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template: `
  <AutobuyerBox
    :autobuyer="autobuyer"
    :name="$t('stuffingAutobuyer')"
    show-interval
  >
    <template #intervalSlot>
      <AutobuyerIntervalButton :autobuyer="autobuyer" />
    </template>
    <template #toggleSlot>
      <button
        v-if="isUnlocked"
        class="o-autobuyer-btn"
        @click="toggleMode"
      >
        {{ modeDisplay }}
      </button>
    </template>
  </AutobuyerBox>
  `
}