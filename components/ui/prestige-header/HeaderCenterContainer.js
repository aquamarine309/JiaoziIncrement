// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button

import UnlockFactoryAndSimulationButton from "./UnlockFactoryAndSimulationButton.js"

export default {
  name: "HeaderCenterContainer",
  components: {
    UnlockFactoryAndSimulationButton
  },
  data() {
    return {
      shouldDisplay: true,
      jiaozi: new Decimal(0),
      jiaoziPerSecond: new Decimal(0),
      money: new Decimal(0),
      hasSimulationButton: false,
      simulationUnlocked: false,
      cores: new Decimal(0),
      showRate: false,
      rate: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.shouldDisplay = player.break || !Player.canFixSteamer
      if (!this.shouldDisplay) return;
      this.jiaoziPerSecond = Maker(1).productionPerSecond
      this.rate = this.jiaoziPerSecond.div(this.jiaozi)
      this.jiaozi = Currency.jiaozi.value;
      this.showRate = player.break && this.rate.gte(1.01)
      this.money = Currency.money.value
      this.hasSimulationButton = PlayerProgress.factoriesUnlocked()
      this.simulationUnlocked = PlayerProgress.simulationUnlocked()
      this.cores = Currency.cores.value
    },
  },
  template: `
    <div
    v-if="shouldDisplay"
    class="c-prestige-button-container"
    >
      <div>{{ $t("youHave") }} <span class="c-game-header__jiaozi">{{ format(jiaozi, 2, 1) }}</span> {{ pluralize($t("jiaozi"), jiaozi) }}{{ $t("stop") }}</div>
      <div class="c-game-header__simulation">
        <div v-if="simulationUnlocked" class="o-simulation-header">
          {{ $t("youHave") }} <span class="c-game-header__sn">{{ format(cores, 2) }}</span> {{ pluralize($t("core"), cores) }}{{ $t("stop") }}
        </div>
        <div
        v-if="hasSimulationButton"
        class="c-simulation-container"
        >
          <UnlockFactoryAndSimulationButton />
        </div>
      </div>
      <div v-if="showRate">
        {{ $t("addPerSec", [formatX(rate, 2, 2)]) }}
      </div>
      <div v-else>
        {{ $t("jiaoziPerSec", [quantify($t("jiaozi"), jiaoziPerSecond, 2, 1)]) }}
      </div>
      <div>
        {{ $t("youHave") }} <span class="c-game-header__money">{{ format(money, 2, 1) }}</span> {{ pluralize($t("money"), money) }}{{ $t("stop") }}
      </div>
    </div>`
}