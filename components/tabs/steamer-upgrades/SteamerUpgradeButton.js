import CostDisplay from "../../CostDisplay.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "SteamerUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showWorstChallenge: false,
      worstChallengeString: "",
      canBeBought: false,
      isBought: false
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-steamer-upgrade-btn": true,
        "o-steamer-upgrade-btn--bought": this.isBought,
        "o-steamer-upgrade-btn--available": !this.isBought && this.canBeBought,
        "o-steamer-upgrade-btn--unavailable": !this.isBought && !this.canBeBought,
      };
    }
  },
  methods: {
    update() {
      // Note that this component is used by both steamer upgrades and break steamer upgrades
      // (putting this comment here rather than at the top of the component since this function
      // seems more likely to be read).
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.canBeBought = upgrade.canBeBought;
    }
  },
  template: `<button
:class="classObject"
@click="upgrade.purchase()"
>
<span>
<DescriptionDisplay
:config="config"
/>
<EffectDisplay
br
:config="config"
/>
</span>
<CostDisplay
v-if="!isBought"
br
:config="config"
:name="$t('sc')"
/>
<slot />
</button>`
}