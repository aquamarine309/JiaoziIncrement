export default {
  name: "AutobuyerIntervalButton",
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cost: 0,
      isMaxed: false,
      isUpgradeable: false,
      isAffordable: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-autobuyer-btn": true,
        "l-autobuyer-box__button": true,
        "o-autobuyer-btn--unavailable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      this.cost = this.autobuyer.cost;
      this.isMaxed = this.autobuyer.hasMaxedInterval;
      this.isUpgradeable = this.autobuyer.canBeUpgraded;
      this.isAffordable = Currency.money.gte(this.cost);
    },
    upgradeInterval() {
      this.autobuyer.upgradeInterval();
    }
  },
  template: `
  <button
    v-if="!isMaxed && isUpgradeable"
    :class="classObject"
    @click="upgradeInterval"
  >
    {{ $t("autobuyerIntervalUpg", [formatPercents(0.4)]) }}
    <br>
    {{ $t("cost") }} {{ format(cost, 2) }} {{ $t("money", null, true) }}
  </button>
  </button>
  `
}