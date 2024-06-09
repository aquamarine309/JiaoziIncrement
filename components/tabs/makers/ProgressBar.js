import { DC } from "../../../core/constants.js";

export default {
  name: "AntimatterDimensionProgressBar",
  data() {
    return {
      fill: 0,
      tooltip: "",
      displayPercents: "",
    };
  },
  computed: {
    progressBarStyle() {
      return {
        width: `${(this.fill * 100).toFixed(2)}%`
      };
    }
  },
  methods: {
    // eslint-disable-next-line complexity
    update() {
      this.displayPercents = formatPercents(this.fill, 2);
      const setProgress = (current, goal, tooltip) => {
        this.fill = Math.clampMax(current.pLog10() / Decimal.log10(goal), 1);
        this.tooltip = tooltip;
      };
      const setLinearProgress = (current, goal, tooltip) => {
        this.fill = Math.clampMax(current / goal, 1);
        this.tooltip = tooltip;
      };

      // Goals for challenges and challenge-like runs should come first because numbers will always be much smaller
      // than normal and therefore default filling won't be meaningful. Since challenges get completed or abandoned from
      // the inside outwards, we show the goals in that priority as well. It only makes sense to check cel6 and not the
      // others because pre-cel3 completion it'll default to e4000 and cel4/5 don't have meaningful single goals
      const inSpecialRun = Player.isInNormalChallenge
      if (inSpecialRun) {
        if (Player.isInNormalChallenge) {
          setProgress(Currency.jiaozi.value, Player.normalChallenge.goal, "挑战进度");
        }
      } else if (Factory(8).isUnlocked) {
        setProgress(Currency.steamerCoins.value, DC.E500, "终止模拟的进度");
      } else if (PlayerProgress.factoriesUnlocked()) {
        setProgress(Currency.money.value, Factories.next().moneyRequirement, $t("p_nextFactory"));
      } else if (PlayerProgress.hasBroken()) {
        setProgress(player.jiaozi, NormalChallenges.requirement, "解锁挑战的进度");
      } else if (PlayerProgress.collectionUnlocked()) {
        setProgress(Currency.jiaozi.value, Decimal.NUMBER_MAX_VALUE, "蒸笼进度");
      } else if (!Stuffing.canBigReset) {
        setProgress(Currency.money.value, DC.E50, "大重置进度")
      } else {
        setProgress(Currency.money.value, Stuffing.cost, "下一个饺子馅进度")
      }
    }
  },
  template: `
  <div>
  <div class="c-progress-bar">
<div
:style="progressBarStyle"
class="c-progress-bar__fill"
>
{{ displayPercents }}
</div>
</div>
<div
class="c-progress-bar__info"
>
{{ $t("current") }}: {{ tooltip }}
</div>
</div>`
}