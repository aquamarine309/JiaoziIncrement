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
			timeToGain: 0,
			showDescription: true,
			timer: null,
			power: new Decimal(0)
		}
	},
	methods: {
		update() {
			this.isAvailable = this.upgrade.canBeBought;
			this.isBought = this.upgrade.isBought;
			this.power = energyPerSecond();
			if (this.rebuyable && !this.isAvailable && this.power.gt(0)) {
			  this.timeToGain = this.upgrade.cost.minus(Currency.energy.value).div(this.power);
			}
		},
		purchase() {
		  if (this.isLocked) return;
		  this.upgrade.purchase();
		},
		toggle() {
		  this.showDescription = !this.showDescription;
		},
		startTimer() {
		  this.timer = setTimeout(this.toggle, 1000);
		},
		endTimer() {
		  clearTimeout(this.timer);
		}
	},
	beforeDestroy() {
	  clearTimeout(this.timer);
	},
	computed: {
	  config() {
	    return this.upgrade.config;
	  },
	  isLocked() {
	    return !this.rebuyable;
	  },
	  btnClass() {
	    return {
	      "o-simulation-upgrade": true,
	      "o-simulation-upgrade--available": this.isAvailable || (this.isLocked && !this.showDescription),
	      "o-simulation-upgrade--bought": this.isBought
	    }
	  },
	  costName() {
	    return $t(this.currency);
	  },
	  timeEstimate() {
	    if (this.isLocked) return "已锁定";
	    if (!this.rebuyable || this.isAvailable) return "点击以购买";
	    if (this.power.lte(0) || this.timeToGain.gte(Decimal.NUMBER_MAX_VALUE)) return "不可购买";
	    return TimeSpan.fromSeconds(this.timeToGain.toNumber()).toStringShort();
	  },
	  requirementText() {
	    return $t("requirement");
	  }
	},
	template: `
	  <button
	    :class="btnClass"
	    @click.exact="purchase"
	    @click.shift="toggle"
	    :ach-tooltip="timeEstimate"
	    @touchstart="startTimer"
	    @touchmove="endTimer"
	    @touchend="endTimer"
	  >
	    <template v-if="!isLocked || showDescription">
  	    <DescriptionDisplay :config="config" />
  	    <EffectDisplay :config="config" />
  	    <CostDisplay
  	      :config="config"
	        :name="costName"
	        unit=""
  	    />
  	    <p v-if="isLocked">完成条件后才能购买</p>
  	  </template>
  	  <template v-else>
  	    <div class="l-lock-overlay">
	        <i class="fas fa-lock" />
	        <p>{{ requirementText }}: {{ upgrade.requirement }}</p>
	      </div>
	    </template>
	  </button>
	`
}