export default {
	name: "SimulationUpgradesTab",
	data() {
		return {
			energy: new Decimal(0),
			power: new Decimal(0)
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
	  }
	},
	methods: {
		update() {
			this.energy = Currency.energy.value;
			this.power = GameCache.totalEnergyMult.value;
		}
	},
	template: `
	  <div>
	    <div class="c-energy-text">
	      {{ youHave }} <span class="c-energy-amount"> {{ format(energy, 2) }} </span> {{ jouleOfEnergy }}{{ stop }}
	    </div>
	    <div>
	      {{ powerInfo }}
	    </div>
	  </div>
	`
}