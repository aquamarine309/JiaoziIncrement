import SimulationUpgradeButton from "./SimulationUpgradeButton.js";

export default {
	name: "SimulationUpgradesTab",
	components: {
	  SimulationUpgradeButton
	},
	data() {
		return {
			energy: new Decimal(0),
			power: new Decimal(0),
			totalRebuyables: 0,
			energyGained: new Decimal(0),
			energyConversionEfficiency: 0
		}
	},
	computed: {
	  youHave() {
	    return $t("youHave");
	  },
	  jouleOfEnergy() {
	    return addScape([pluralize($t("joule"), this.energy, null, ""), $t("of"), $t("energy")]);
	  },
	  stop() {
	    return $t("stop");
	  },
	  powerInfo() {
	    return $t("corePower", [quantify($t("watt"), this.power, 2, 0, format, "")]);
	  },
	  rebuyables() {
	    return SimulationRebuyable.all;
	  },
	  normal() {
	    const result = [];
	    for (let i = 0; i < SimulationUpgrade.all.length; i += 5) {
	      result.push(SimulationUpgrade.all.slice(i, i + 5));
	    }
	    return result;
	  },
	  reviewText() {
	    return $t("review");
	  },
	  previewText() {
	    return $t("preview");
	  }
	},
	methods: {
		update() {
			this.energy = Currency.energy.value;
			this.power = GameCache.totalEnergyMult.value;
			this.totalRebuyables = SimulationRebuyableGroup.totalBought;
			this.energyGained = format(player.simulation.spentEnergy.times(0.8), 2, 1);
			this.energyConversionEfficiency = GameCache.energyConversionEfficiency.value;
		},
		reset() {
		  resetAllSimulationUpgrades();
		}
	},
	template: `
	  <div class="c-simulation-upgrades-tab">
	    <div class="c-simulation-block--container">
	      <div class="c-simulation-block">
	        <div class="c-energy-text">
    	      {{ youHave }} <span class="c-energy-amount"> {{ format(energy, 2)     }} </span> {{ jouleOfEnergy }}{{ stop }}
  	      </div>
  	      <div>
    	      {{ powerInfo }}
    	    </div>
    	    <br>
    	    <p>每次购买"温故"升级后，其他"温故"升级的价格都会上涨。</p>
    	    <p>你共购买了{{ format(totalRebuyables, 2) }}次"温故"升级。</p>
	      </div>
	      <div class="c-simulation-block">
	        <button
    	      class="c-reset-simulation-rebuyables"
    	      @click="reset"
	        >
	          终止模拟并重置所有模拟升级(+{{ energyGained }} {{ $t("energy") }})
    	    </button>
	        <p>重置升级时，你将保留{{ formatPercents(energyConversionEfficiency) }}的饺子能量。</p>
	        <p>"知新"升级需要用核心饺子购买。</p>
	        <p>购买"知新"升级时，核心饺子的数量至少要比价格多{{ formatInt(15) }}，确保里程碑保持有效状态。</p>
	      </div>
	    </div>
	    <h2>{{ reviewText }}</h2>
	    <div class="c-simulation-upgrade-row">
	      <SimulationUpgradeButton
	        v-for="upgrade in rebuyables"
	        :upgrade="upgrade"
	        :rebuyable="true"
	        currency="energy"
	        :key="upgrade.id"
	      />
	    </div>
	    <h2>{{ previewText }}</h2>
	    <div
	      class="c-simulation-upgrade-row"
	      v-for="(row, index) in normal"
	      :key="\`\${index}row\`"
	    >
	      <SimulationUpgradeButton
	        v-for="upgrade in row"
	        :upgrade="upgrade"
	        :rebuyable="false"
	        currency="core"
	        :key="upgrade.id + 5"
	      />
	    </div>
	  </div>
	`
}