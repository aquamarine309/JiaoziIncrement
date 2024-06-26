import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel.js";

// This component is used for autobuyer entries which take up an entire row and may (AD/tickspeed) or may not
// (prestige) have an associated slow version unlockable pre-infinity
export default {
  name: "AutobuyerBox",
  components: {
    AutobuyerIntervalLabel
  },
  props: {
    autobuyer: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    showInterval: {
      type: Boolean,
      required: false,
      default: false
    },
    isModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isUnlocked: false,
      isActive: false,
      globalToggle: false,
      canBeBought: false,
      isUnlockable: false,
      moneyCost: new Decimal(),
      isBought: false,
      money: new Decimal(),
      currMode: 0,
      nextValue: 0,
      nextTime: 0,
    };
  },
  computed: {
    autobuyerBuyBoxClass() {
      return {
        "c-autobuyer-buy-box": true,
        "o-primary-btn": true,
        "o-primary-btn--enabled": this.isUnlockable,
        "o-primary-btn--disabled": !this.isUnlockable
      };
    },
    autobuyerBoxRowClass() {
      return {
        "c-autobuyer-box-row": true,
        "c-autobuyer-box-row__modal": this.isModal
      };
    },
    autobuyerToggleClass() {
      if (!this.globalToggle) {
        return this.isActive ? "fas fa-pause" : "fas fa-times";
      }
      return this.isActive ? "fas fa-check" : "fas fa-times";
    },
    autobuyerStateClass() {
      if (!this.globalToggle) {
        return {
          "o-autobuyer-toggle-checkbox__label": true,
          "o-autobuyer-toggle-checkbox__label-modal": this.isModal,
          "o-autobuyer-toggle-checkbox__label--active-paused": this.isActive,
          "o-autobuyer-toggle-checkbox__label--deactive-paused": !this.isActive,
          "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
        };
      }
      return {
        "o-autobuyer-toggle-checkbox__label": true,
        "o-autobuyer-toggle-checkbox__label-modal": this.isModal,
        "o-autobuyer-toggle-checkbox__label--active": this.isActive,
        "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
      };
    }
  },
  watch: {
    isActive(newValue) {
      this.autobuyer.isActive = newValue;
    }
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isUnlocked = autobuyer.isUnlocked;
      this.isActive = autobuyer.isActive;
      this.globalToggle = player.auto.autobuyersOn;
      this.canBeBought = autobuyer.canBeBought;
      this.isUnlockable = autobuyer.canUnlockSlowVersion;
      this.moneyCost = autobuyer.moneyCost;
      this.isBought = autobuyer.isBought;
      this.money = player.records.thisBigReset.maxMoney

      this.currMode = autobuyer.mode;
      if (this.isShowingStateInfo) {
        this.nextValue = new Decimal(autobuyer.highestPrevPrestige).times(autobuyer.xHighest);
        this.nextTime = autobuyer.timeToNextTick;
      }
    },
    toggle() {
      this.isActive = !this.isActive;
    },
    purchase() {
      this.autobuyer.purchase();
      //TabNotification.newAutobuyer.clearTrigger();
      GameCache.cheapestMakerAutobuyer.invalidate();
    }
  },
  template: `
  <div
    v-if="isUnlocked || isBought"
    :class="autobuyerBoxRowClass"
  >
    <div class="l-autobuyer-box__header">
      {{ name }}
      <AutobuyerIntervalLabel
        v-if="showInterval"
        :autobuyer="autobuyer"
      />
    </div>
    <div class="c-autobuyer-box-row__intervalSlot">
      <slot name="intervalSlot" />
    </div>
    <div class="c-autobuyer-box-row__toggleSlot">
      <slot name="toggleSlot" />
    </div>
    <div class="c-autobuyer-box-row__checkboxSlot">
      <slot name="checkboxSlot" />
    </div>
    <div class="c-autobuyer-box-row__optionSlot">
      <slot name="optionSlot" />
    </div>
    <div
      class="l-autobuyer-box__footer"
      @click="toggle"
    >
      <label :class="autobuyerStateClass">
        <span :class="autobuyerToggleClass" />
      </label>
      <input
      :checked="isActive && globalToggle"
      :disabled="!globalToggle"
      :name="name"
      type="checkbox"
    >
    </div>
  </div>
  <div
    v-else-if="canBeBought"
    :class="autobuyerBuyBoxClass"
    @click="purchase"
  >
    {{ name }}
    <br>
    {{ $t("unlockAutobuyer", [format(moneyCost)]) }}
  </div>
  `
}