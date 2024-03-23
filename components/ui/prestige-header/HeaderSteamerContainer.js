import SteamerButton from "./SteamerButton.js";

export default {
  name: "HeaderSteamerContainer",
  components: {
    SteamerButton,
  },
  data() {
    return {
      showContainer: false,
      steamerCoins: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.showContainer = player.
      break || PlayerProgress.steamerUnlocked();
      this.steamerCoins.copyFrom(Currency.steamerCoins.value.floor());
    }
  },
  template: `
  <div
    v-if="showContainer"
    class="c-prestige-button-container"
  >
    <div class="c-steamer-coins">
      {{ $t("youHave") }}
      <span class="c-game-header__sc-amount">{{ format(steamerCoins, 2) }}</span>
      {{ pluralize($t("sc"), steamerCoins) }}
    </div>
    <SteamerButton />
  </div>
  `
}