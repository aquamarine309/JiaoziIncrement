import PrimaryButton from '../../PrimaryButton.js'
import PrimaryToggleButton from '../../PrimaryToggleButton.js'

export default {
  name: 'FactoryRow',
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      amoumt: new Decimal(0),
      multiplier: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      rate: new Decimal(0),
      name: '',
      isUnlocked: false,
      isAutobuyerUnlocked: false,
      isAutobuyerOn: false
    }
  },
  methods: {
    update() {
      const factory = Factory(this.tier);
      this.amount = factory.amount;
      this.multiplier = factory.multiplier;
      this.isUnlocked = factory.isUnlocked;
      this.cost = this.isUnlocked ? factory.cost : factory.moneyRequirement;
      this.isAvailableForPurchase = this.isUnlocked ? factory.isAvailableForPurchase : factory.canUnlock;
      this.rate = factory.rate;
      this.name = factory.name;
      this.isAutobuyerUnlocked = SimulationMilestone.autoFactory.isReached;
      this.isAutobuyerOn = Autobuyer.factory(this.tier).isActive;
    },
    buySingle() {
      Factory(this.tier).buySingle();
    },
    buyMaxFactory() {
      Factory(this.tier).buyMax();
    }
  },
  computed: {
    rowClass() {
      return {
        'o-factory-row': true,
        "o-factory-row--locked": !this.isUnlocked
      }
    },
    btnClass() {
      return {
        'o-btn-buy-factory': true,
        'o-btn-buy-factory--affordable': this.isAvailableForPurchase
      }
    },
    showRate() {
      return this.rate.neq(0)
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.factory(this.tier).isActive = newValue;
    }
  },
  template: `
  <div :class='rowClass'>
    <div class='o-factory-name-multiplier'>
      <div class='o-factory-name'>
        {{ name }}
      </div>
      <div class='o-factory-multiplier'>
        {{ formatX(multiplier, 2, 3) }}
      </div>
    </div>
    <div class='o-factory-amount-rate'>
      <div class='o-factory-amount'>
        {{ format(amount, 2) }}
      </div>
      <div class='o-factory-rate' v-if='showRate'>
        (+{{ format(rate.times(100), 2, 2) }}%/s)
      </div>
    </div>
    <div class='o-buy-factory-container'>
      <PrimaryButton
        :enabled='isAvailableForPurchase'
        @click='buySingle()'
        :class='btnClass'
      >
        {{ format(cost, 2, 2) }}
        <span v-if="isUnlocked">
          {{ pluralize($t("sc"), cost) }}
        </span>
        <span v-else>
          {{ pluralize($t("money"), cost) }}
        </span>
      </PrimaryButton>
      
      <PrimaryToggleButton
        v-if="isAutobuyerUnlocked"
        v-model="isAutobuyerOn"
        class="o-primary-btn--factory-auto"
        :label="$t('auto_')"
      />
      <PrimaryButton
        v-else
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--factory-auto"
        @click="buyMaxFactory"
      >
        {{ $t("maxAll") }}
      </PrimaryButton>
    </div>
  </div>
  `
}