import CostDisplay from "../../CostDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import HintText from "../../HintText.js";


export default {
  name: "WrapperButton",
  components: {
    EffectDisplay,
    CostDisplay,
    HintText
  },
  data() {
    return {
      canBeBought: false,
      base: new Decimal(0),
      amount: 0,
      cost: new Decimal(0),
      isAffordable: false,
      freeAmount: 0,
      hasTutorial: false,
      unlcokedText: "",
      totalAmount: 0,
      name: ""
    };
  },
  computed: {
    classObject() {
      return {
        "o-wrapper-btn": true,
        "o-wrapper-btn--available": this.canBeBought && this.isAffordable,
        "tutorial--glow": this.canBeBought && this.isAffordable && this.hasTutorial,
      }
    },
    config() {
      return {
        effect: this.base.pow(this.amount + this.freeAmount),
        formatEffect: value => formatX(value, 2, 3),
        cost: this.cost,
        formatCost: value => format(value, 2)
      }
    },
    nextEffectConfig() {
      return {
        effect: this.base.pow(this.amount + this.freeAmount + 1),
        formatEffect: value => formatX(value, 2, 3),
      }
    },
    amountText() {
      if (this.freeAmount > 0) {
        if (this.amount === 0) {
          return format(this.freeAmount, 2, 2)
        }
        return `${formatInt(this.amount)} + ${format(this.freeAmount, 2, 2)} = ${format(this.amount + this.freeAmount, 2, 2)}`
      }
      return formatInt(this.amount)
    }
  },
  methods: {
    update() {
      this.name  = Wrapper.name;
      this.canBeBought = Wrapper.canBeBought;
      this.amount = Wrapper.amount;
      this.freeAmount = Wrapper.freeAmount;
      this.totalAmount = Wrapper.totalAmount;
      this.cost = Wrapper.cost;
      this.base = Wrapper.base;
      this.isAffordable = Wrapper.isSatisfied;
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.WRAPPER);
      if (!this.canBeBought) this.unlockedText = Wrapper.unlockedText;
    },
    purchase() {
      buyMaxWrapper();
    }
  },
  template: `
  <div>
    <h2>
      {{ pluralize(name, totalAmount, undefined, "") }}({{ amountText }})
    </h2>
    <button
    :class="classObject"
    @click="purchase"
    >
      <div v-if="canBeBought">
        {{ $t("wrapperDes", [formatX(base, 2, 3)]) }}
      </div>
      <div v-else>
        {{ unlockedText }}
      </div>
      <div style='font-size: 1.1rem; width: 100%;'>
        <EffectDisplay
          :config="config"
        />
        <span v-if="canBeBought">
        <span>|</span>
        <EffectDisplay
          :config="nextEffectConfig"
          label='next'
        />
        </span>
      </div>
      <CostDisplay
      :config="config"
      :name='$t("money")'
      />
      <div
      v-if="hasTutorial"
      class="fas fa-circle-exclamation l-notification-icon"
      />
  </button>
</div>
  `
};
