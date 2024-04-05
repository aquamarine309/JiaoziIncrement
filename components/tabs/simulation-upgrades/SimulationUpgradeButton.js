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
			isBought: true
		}
	},
	methods: {
		update() {
			this.isAvailable = this.upgrade.canBeBought;
			this.isBought = this.upgrade.isBought;
		},
		purchase() {
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
	  }
	},
	template: `
	  <button
	    :class="btnClass"
	    @click="purchase"
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
  	      v-if="isLocked"
	      >
	        <i class="fas fa-lock" />
	      </div>
	    </template>
	  </button>
	`
}