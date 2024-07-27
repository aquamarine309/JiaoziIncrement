import PrimaryButton from '../../PrimaryButton.js'

export default {
  name: 'JiaoziSaleButton',
  components:  {
    PrimaryButton
  },
  data() {
    return {
      text: '',
      info: '',
      available: true
    }
  },
  methods: {
    update() {
      this.isAvailable = Sale.isAvailable;
      this.showInfo = !PlayerProgress.simulationUnlocked() || !NormalChallenge(2).isCompleted;
      const willGainMoney = gainedMoney();
      if (!this.isAvailable) {
        this.text = $t("saleDisabled");
        this.info = Sale.unavailableText;
      } else {
        this.text = $t("saleTip", [quantify($t("money"), willGainMoney, 2, 2)]);
        if (NormalChallenge(2).isCompleted) {
          this.info = $t("autoMoney");
        } else if (player.maxResetJiaozi.eq(0)) {
          this.info = $t("noSale");
        } else {
          this.info = $t("mostSale", [quantify($t("jiaozi"), player.maxResetJiaozi, 2, 1)]);
        }
      }
    },
    sale() {
      saleReset();
    }
  },
  template: `
    <PrimaryButton
    :enabled='isAvailable'
    @click='sale'
    class='o-sale-btn'
    >
      <span>{{ text }}</span>
      <br v-if="showInfo">
      <span v-if="showInfo">({{ info }})</span>
    </PrimaryButton>
  `
}