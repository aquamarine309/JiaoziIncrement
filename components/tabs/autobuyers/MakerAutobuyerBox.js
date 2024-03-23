import AutobuyerBox from "./AutobuyerBox.js";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton.js";

export default {
  name: "MakerAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerIntervalButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      mode: AUTOBUYER_MODE.BUY_SINGLE
    };
  },
  computed: {
    autobuyer() {
      return Autobuyer.maker(this.tier);
    },
    name() {
      return Maker(this.tier)
        .name;
    },
    modeDisplay() {
      switch (this.mode) {
        case AUTOBUYER_MODE.BUY_SINGLE:
          return $t("buysSingles");
        case AUTOBUYER_MODE.BUY_MAX:
          return $t("buysMax");
      }
      throw "Unknown Maker Autobuyer mode";
    }
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template: `
  <AutobuyerBox
    :autobuyer="autobuyer"
    :name="name"
  show-interval
  >
    <template #intervalSlot>
      <AutobuyerIntervalButton :autobuyer="autobuyer" />
    </template>
    <template #toggleSlot>
      <button
        class="o-autobuyer-btn"
        @click="toggleMode"
      >
        {{ modeDisplay }}
      </button>
    </template>
  </AutobuyerBox>
  `
}