import CostDisplay from "../../CostDisplay.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
	name: "SimulationUpgradeButton",
	components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
  },
	props: {
	  upgrade: {
	    type: Object,
	    required: true
	  },
	  rebuyable: {
	    type: Boolean,
	    required: false,
	    default: false
	  },
	  currency: {
	    type: String,
	    required: true
	  }
	},
	data() {
		return {
			isAvailable: true,
			isBought: true,
			timeToGain: 0
		}
	},
	methods: {
		update() {
			this.isAvailable = this.upgrade.canBeBought;
			this.isBought = this.upgrade.isBought;
			if (this.rebuyable && !this.isAvailable && energyPerSecond().gt(0)) {
			  this.timeToGain = this.upgrade.cost.minus(Currency.energy.value).div(energyPerSecond());
			}
		},
		purchase() {
		  if (this.isLocked) return;
		  this.upgrade.purchase();
		}
	},
	computed: {
	  config() {
	    return this.upgrade.config
	  },
	  isLocked() {
	    return !this.rebuyable;
	  },
	  btnClass() {
	    return {
	      "o-simulation-upgrade": true,
	      "o-simulation-upgrade--available": this.isAvailable || this.isLocked,
	      "o-simulation-upgrade--bought": this.isBought
	    }
	  },
	  costName() {
	    return $t(this.currency);
	  },
	  lockTooltip() {
	    return `${formatInt(5)}小时后更新`
	  },
	  timeEstimate() {
	    if (!this.rebuyable || this.isAvailable) return "点击以购买";
	    if (energyPerSecond().lte(0) || this.timeToGain.gte(Decimal.NUMBER_MAX_VALUE)) return "Never affordable."
	    return TimeSpan.fromSeconds(this.timeToGain.toNumber()).toStringShort();
	  }
	},
	template: `
	  <button
	    :class="btnClass"
	    @click="purchase"
	    :ach-tooltip="timeEstimate"
	  >
	    <template v-if="!isLocked">
  	    <DescriptionDisplay :config="config" />
  	    <EffectDisplay :config="config" />
  	    <CostDisplay
  	      :config="config"
	        :name="costName"
	        unit=""
  	    />
  	  </template>
  	  <template v-else>
  	    <div
  	      class="l-lock-overlay"
  	      :ach-tooltip="lockTooltip"
  	      v-if="isLocked"
	      >
	        <i class="fas fa-lock" />
	      </div>
	    </template>
	  </button>
	`
}