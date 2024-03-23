export default {
  name: "AutobuyerModeButton",
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mode: AUTOBUYER_MODE.BUY_SINGLE
    };
  },
  computed: {
    modeDisplay() {
      switch (this.mode) {
        case AUTOBUYER_MODE.BUY_SINGLE:
          return $t("buysSingles");
        case AUTOBUYER_MODE.BUY_MAX:
          return $t("buysMax");
      }
      throw "Unknown ? Autobuyer mode";
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
  <button
    class="o-autobuyer-btn o-autobuyer-btn--tiny"
    @click="toggleMode"
  >
    {{ modeDisplay }}
  </button>
  `
}