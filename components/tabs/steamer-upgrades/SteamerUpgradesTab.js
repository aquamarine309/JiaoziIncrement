import SteamerUpgradeButton from "./SteamerUpgradeButton.js";
import BreakInfinityButton from "./BreakInfinityButton.js"
import ScMultiplierButton from "./ScMultiplierButton.js"

export default {
  name: "SteamerUpgradesTab",
  components: {
    SteamerUpgradeButton,
    BreakInfinityButton,
    ScMultiplierButton
  },
  data() {
    return {
      styleOfColumnBg: undefined,
      allUpgs: false,
      bottomRowUnlocked: false
    };
  },
  computed: {
    grid() {
      return [
        [
          SteamerUpgrade.makerPow,
          SteamerUpgrade.steamerCountMult,
          SteamerUpgrade.scGen,
          SteamerUpgrade.scMult
        ],
        [
          SteamerUpgrade.collectionsMult,
          SteamerUpgrade.commonPower,
          SteamerUpgrade.timeBoost,
          SteamerUpgrade.unlockSteamerAuto
        ],
        [
          SteamerUpgrade.keepWrapper,
          SteamerUpgrade.keepStuffing,
          SteamerUpgrade.keepCollections,
          SteamerUpgrade.resetRequirement
        ],
        [
          SteamerUpgrade.nextMaker1,
          SteamerUpgrade.nextMaker2,
          SteamerUpgrade.nextMaker3,
          SteamerUpgrade.nextMaker4
        ]
      ];
    },
    allColumnUpgrades() {
      return this.grid.flat();
    },
    disChargeClassObject() {
      return {
        "o-primary-btn--subtab-option": true
      };
    }
  },
  watch: {},
  created() {
    this.on$(GAME_EVENT.STEAMER_UPGRADE_BOUGHT, () => this.setStyleOfColumnBg());
    this.setStyleOfColumnBg();
  },
  methods: {
    update() {
      this.allUpgs = Player.allSteamerUpgradesBought
      this.bottomRowUnlocked = NormalChallenge(6).isCompleted
    },
    btnClassObject(column) {
      const classObject = {
        "l-steamer-upgrade-grid__cell": true
      };
      if (column > 0) {
        // Indexing starts from 0, while css classes start from 2 (and first column has default css class)
        classObject[`o-steamer-upgrade-btn--color-${column + 1}`] = true;
      }
      return classObject;
    },
    getColumnColor(location) {
      if (location.isBought) return "var(--color-steamer)";
      return "transparent";
    },
    setStyleOfColumnBg() {
      this.styleOfColumnBg = this.grid.map(col => ({
        background: `linear-gradient(to bottom,
${this.getColumnColor(col[0])} 15%,
${this.getColumnColor(col[1])} 35% 40%,
${this.getColumnColor(col[2])} 60% 65%,
${this.getColumnColor(col[3])} 85% 100%`
      }));
    },
  },
  template: `<div class="l-steamer-upgrades-tab">
<br>
 {{ $t("suHeader") }}
<br>
<div class="l-steamer-upgrade-grid l-steamer-upgrades-tab__grid">
<div
v-for="(column, columnId) in grid"
:key="columnId"
class="c-steamer-upgrade-grid__column"
>
<SteamerUpgradeButton
v-for="upgrade in column"
:key="upgrade.id"
:upgrade="upgrade"
:class="btnClassObject(columnId)"
/>
<div
class="c-steamer-upgrade-grid__column--background"
:style="styleOfColumnBg[columnId]"
/>
</div>
</div>
<div class="o-break-btn-container" v-if="allUpgs">
  <BreakInfinityButton />
</div>

<div
v-if="bottomRowUnlocked"
class="l-steamer-upgrades-bottom-row"
>
<ScMultiplierButton class="l-steamer-upgrades-tab__mult-btn" />
</div>
</div>`
}