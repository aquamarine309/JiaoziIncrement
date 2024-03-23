import AutobuyerBox from "./AutobuyerBox.js";
import AutobuyerDropdownEntry from "./AutobuyerDropdownEntry.js";
import AutobuyerInput from "./AutobuyerInput.js";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton.js";
import ExpandingControlBox from "../../ExpandingControlBox.js";

export default {
  name: "SaleAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerIntervalButton,
    AutobuyerInput,
    ExpandingControlBox,
    AutobuyerDropdownEntry
  },
  props: {
    isModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      postBreak: false,
      hasMaxedInterval: false,
      mode: AUTO_SALE_MODE.AMOUNT,
      hasAdditionalModes: false,
      increaseWithMult: true,
    };
  },
  computed: {
    autobuyer: () => Autobuyer.sale,
    modes: () => [
      AUTO_SALE_MODE.AMOUNT,
      AUTO_SALE_MODE.TIME,
      AUTO_SALE_MODE.X_HIGHEST,
    ]
  },
  watch: {
    increaseWithMult(newValue) {
      this.autobuyer.increaseWithMult = newValue;
    }
  },
  methods: {
    update() {
      this.hasMaxedInterval = this.autobuyer.hasMaxedInterval;
      this.mode = this.autobuyer.mode;
      this.hasAdditionalModes = this.autobuyer.hasAdditionalModes;
      this.postBreak = this.hasMaxedInterval;
      this.increaseWithMult = this.autobuyer.increaseWithMult;
    },
    modeProps(mode) {
      switch (mode) {
        case AUTO_BIG_RESET_MODE.AMOUNT:
          return {
            title: $t("sale_amount"),
              input: {
                property: "amount",
                type: "decimal"
              },
          };
        case AUTO_BIG_RESET_MODE.TIME:
          return {
            title: $t("sale_time"),
              input: {
                property: "time",
                type: "float"
              },
          };
        case AUTO_BIG_RESET_MODE.X_HIGHEST:
          return {
            title: $t("sale_x_highest"),
              input: {
                property: "xHighest",
                type: "decimal"
              },
          };
      }
      throw new Error("Unknown Auto Sell mode");
    },
    modeName(mode) {
      return this.modeProps(mode).title;
    },
  },
  template: `
  <AutobuyerBox
    :autobuyer="autobuyer"
    :show-interval="!postBreak"
    :is-modal="isModal"
    :name="$t('autoSell')"
  >
    <template
      v-if="!hasMaxedInterval"
      #intervalSlot
    >
      <AutobuyerIntervalButton :autobuyer="autobuyer" />
    </template>
    <template
      v-else-if="postBreak"
      #intervalSlot
    >
      <ExpandingControlBox
        v-if="hasAdditionalModes"
        :auto-close="true"
      >
        <template #header>
          <div class="o-primary-btn c-autobuyer-box__mode-select c-autobuyer-box__mode-select-header">
            {{ $t("currentSetting") }}
            <br>
            {{ modeName(mode) }}
          </div>
        </template>
        <template #dropdown>
          <AutobuyerDropdownEntry
            :autobuyer="autobuyer"
            :modes="modes"
            :mode-name-fn="modeName"
          />
        </template>
      </ExpandingControlBox>
      <span v-else>
        {{ modeProps(mode).title }}:
      </span>
    </template>
    <template
      v-if="postBreak"
      #toggleSlot
    >
      <AutobuyerInput
        :key="mode"
        :autobuyer="autobuyer"
        v-bind="modeProps(mode).input"
      />
    </template>
    <template
      v-if="postBreak"
      #checkboxSlot
    >
      <label
        class="o-autobuyer-toggle-checkbox o-clickable"
      >
        <input
        v-model="increaseWithMult"
        type="checkbox"
        class="o-clickable"
      >
        {{ $t("dynamicAmount") }}
      </label>
    </template>
  </AutobuyerBox>
  `
}