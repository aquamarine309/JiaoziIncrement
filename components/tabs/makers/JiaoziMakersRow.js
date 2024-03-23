import PrimaryButton from '../../PrimaryButton.js'

export default {
  name: 'JiaoziMakersRow',
  components: {
    PrimaryButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      makers: new Decimal(0),
      multiplier: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      isAvailable: false,
      rate: new Decimal(0),
      name: '',
      hasTutorial: false
    }
  },
  methods: {
    update() {
      const maker = Maker(this.tier)
      this.makers = maker.amount
      this.multiplier = maker.multiplier
      this.cost = maker.cost
      this.isAffordable = maker.isAffordable && maker.isAvailable
      this.isAvailable = maker.isAvailable
      this.rate = maker.rate
      this.name = maker.name
      this.hasTutorial = (maker.tier === 1 && Tutorial.isActive(TUTORIAL_STATE.MAKER1))
    },
    buySingle() {
      buySingleMaker(this.tier)
    }
  },
  computed: {
    rowClass() {
      return {
        'o-maker-row': true,
        "o-maker-row--unavailable": !this.isAvailable
      }
    },
    btnClass() {
      return {
        'o-btn-buy-maker': true,
        'o-btn-buy-maker--affordable': this.isAffordable,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      }
    },
    showRate() {
      return this.rate.neq(0)
    }
  },
  template: `
    <div :class='rowClass'>
      <div class='o-maker-name-multiplier'>
        <div class='o-maker-name'>
          {{ name }}
        </div>
        <div class='o-maker-multiplier'>
          {{ formatX(multiplier, 2, 3) }}
        </div>
      </div>
      <div class='o-maker-amount-rate'>
        <div class='o-maker-amount'>
          {{ format(makers, 2) }}
        </div>
        <div class='o-maker-rate' v-if='showRate'>
          (+{{ format(rate.times(100), 2, 2) }}%/s)
        </div>
      </div>
      <div class='o-buy-maker-container'>
        <PrimaryButton
        :enabled='isAffordable'
        @click='buySingle()'
        :class='btnClass'
        >
          <span v-if="isAvailable">
            {{ quantify($t("jiaozi"), cost, 2, 2) }}
          </span>
          <span v-else>
            {{ $t("locked") }}
          </span>
          <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
          />
        </PrimaryButton>
      </div>
    </div>
  `
}