import JiaoziSaleButton from './JiaoziSaleButton.js'
import PrimaryButton from '../../PrimaryButton.js'

export default {
  name: 'MakerTabHeader',
  components: {
    JiaoziSaleButton,
    PrimaryButton
  },
  data() {
    return {
      showToggleBtn: false,
      currencyName: ""
    }
  },
  methods: {
    update() {
      this.showToggleBtn = SimulationUpgrade.moneyMaker.isBought;
      if (!this.showToggleBtn) return;
      this.currencyName = Makers.currencyName;
    },
    maxAll() {
      maxAll();
    },
    toggleCurrency() {
      Makers.toggle();
    }
  },
  template: `
    <div class='o-maker-tab-header'>
      <PrimaryButton
        @click="toggleCurrency"
        v-if="showToggleBtn"
        class="o-maker-currency-toggle"
      >
        当前货币:
        <br>
        {{ currencyName }}
      </PrimaryButton>
      <JiaoziSaleButton />
      <PrimaryButton
        @click='maxAll'
        class='o-maker-max-all'
      >
        {{ $t("maxAll") }}
        <br>
        (M)
      </PrimaryButton>
    </div>
  `
}