import CostDisplay from "../../CostDisplay.js";
import HintText from "../../HintText.js";

export default {
  name: "StuffingButton",
  components: {
    CostDisplay,
    HintText
  },
  data() {
    return {
      canBeBought: false,
      isCapped: false,
      base: new Decimal(0),
      amount: 0,
      cost: new Decimal(0),
      lockedText: '',
      isAffordable: false,
      canBigReset: false,
      hasTutorial: false,
      colAmount: 0,
      layerName: "",
      collName: "",
      name: ""
    };
  },
  computed: {
    classObject() {
      return {
        "o-stuffing-btn": true,
        "o-stuffing-btn--available": this.canBeBought && this.isAffordable,
        "o-stuffing-btn--can-big-reset": this.canBigReset,
        "o-stuffing-btn--cannot-big-reset": this.canBigReset && !this.isAffordable,
        "tutorial--glow": this.canBeBought && this.isAffordable && this.hasTutorial,
      }
    },
    config() {
      return {
        cost: this.cost,
        formatCost: value => format(value, 2)
      }
    }
  },
  methods: {
    update() {
      this.name = Stuffing.name;
      this.canBeBought = Stuffing.canBeBought;
      this.amount = Stuffing.amount;
      this.cost = Stuffing.cost;
      this.isAffordable = Stuffing.isSatisfied;
      this.canBigReset = Stuffing.amount === Stuffing.bigResetAmount;
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.STUFFING);
      this.colAmount = gainedCols();
      const unlocked = PlayerProgress.collectionUnlocked;
      this.layerName = unlocked ? $t("bigReset")  : $t("_bigReset");
      this.collName = unlocked ? $t("collection") : $t("first_collection");
      if (!this.canBeBought) this.lockedText = Stuffing.lockedText;
    },
    purchase() {
      manualRequestStuffing()
    }
  },
  template: `
  <div>
    <h2>
      {{ pluralize(name, amount, undefined, "") }}({{ formatInt(amount) }})
    </h2>
    <button
    :class="classObject"
    @click="purchase"
    >
      <div v-if='canBigReset'>
        {{ $t("bigResetDes", [quantify(collName, colAmount, 2), layerName]) }}
      </div>
      <div v-else-if='canBeBought'>
        {{ $t("stuffingDes") }}
      </div>
      <div v-else>
        {{ lockedText }}
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
