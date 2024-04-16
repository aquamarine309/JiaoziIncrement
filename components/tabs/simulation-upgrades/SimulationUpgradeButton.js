import CostDisplay from "../../CostDisplay.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import CustomizeableTooltip from "../../CustomizeableTooltip.js";

export default {
	name: "SimulationUpgradeButton",
	components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    CustomizeableTooltip
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
			timeToGain: new Decimal(0),
			power: new Decimal(0),
			showTooltip: false,
			isLocked: false,
			canUnlock: false
		}
	},
	methods: {
		update() {
			this.isAvailable = this.upgrade.canBeBought;
			this.isBought = this.upgrade.isBought;
			this.power = energyPerSecond();
			this.isLocked = !this.rebuyable && !this.upgrade.isUnlocked;
			this.canUnlock = this.upgrade.canUnlock;
			if (this.rebuyable && !this.isAvailable && this.power.gt(0)) {
			  this.timeToGain = this.upgrade.cost.minus(Currency.energy.value).div(this.power);
			}
		},
		purchase() {
		  if (this.isLocked) {
		    this.upgrade.tryUnlock();
		  } else {
		    this.upgrade.purchase();
		  }
		}
	},
	computed: {
	  config() {
	    return this.upgrade.config;
	  },
	  btnClass() {
	    return {
	      "o-simulation-upgrade": true,
	      "o-simulation-upgrade--available": this.isAvailable || this.canUnlock,
	      "o-simulation-upgrade--bought": this.isBought
	    }
	  },
	  costName() {
	    return $t(this.currency);
	  },
	  timeEstimate() {
	    if (this.isAvailable) return "";
	    if (!this.rebuyable) {
	      return `还差 ${quantify($t("core"), this.config.cost - Currency.cores.value.toNumber() + 15)}`
	    }
	    if (this.power.lte(0) || this.timeToGain.gte(Decimal.NUMBER_MAX_VALUE)) return "不可购买";
	    return TimeSpan.fromSeconds(this.timeToGain.toNumber()).toStringShort();
	  },
	  requirementText() {
	    return `${$t("requirement")}: ${this.upgrade.requirement}`
	  }
	},
	template: `
	  <button
	    :class="btnClass"
	    @click="purchase"
	    @mouseover="showTooltip = true"
	    @mouseleave="showTooltip = false"
	  >
	    <CustomizeableTooltip
        v-if="timeEstimate"
        :show="showTooltip && !isAvailable && !isLocked && !isBought"
        left="50%"
        top="0"
      >
        <template #tooltipContent>
          {{ timeEstimate }}
        </template>
      </CustomizeableTooltip>
  	  <DescriptionDisplay :config="config" />
  	  <EffectDisplay :config="config" />
	    <p v-if="isLocked">{{ requirementText }}</p>
      <CostDisplay
        v-else-if="!isBought"
 	      :config="config"
	      :name="costName"
	      unit=""
	    />
	    <p v-if="canUnlock">点击以解锁升级</p>
	  </button>
	`
}