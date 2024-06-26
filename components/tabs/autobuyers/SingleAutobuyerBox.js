import AutobuyerInput from "./AutobuyerInput.js";
import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel.js";
import AutobuyerSingleToggleLabel from "./AutobuyerSingleToggleLabel.js";

// This component contains a single "special" autobuyer toggle (eg. sacrifice, annihilation, 2xIP etc.)
export default {
  name: "SingleAutobuyerBox",
  components: {
    AutobuyerSingleToggleLabel,
    AutobuyerIntervalLabel,
    AutobuyerInput
  },
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      // Used to hide the input box if the game is auto-sacrificing every tick without resource resets
      isHiddenSacrifice: false,
    };
  },
  computed: {
    name() {
      return this.autobuyer.name;
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.autobuyer.isUnlocked;
    },
  },
  template: `
  <span
    v-if="isUnlocked"
    class="c-autobuyer-box-row"
  >
    <AutobuyerSingleToggleLabel :autobuyer="autobuyer" />
    <div>
      {{ name }}
      <AutobuyerIntervalLabel :autobuyer="autobuyer" />
      <span
        v-if="autobuyer.hasInput"
        class="c-autobuyer-box__small-text"
      >
        Multiplier:
        <AutobuyerInput
          class="c-small-autobuyer-input"
          :autobuyer="autobuyer"
          :type="autobuyer.inputType"
          :property="autobuyer.inputEntry"
        />
      </span>
    </div>
  </span>
  `
}