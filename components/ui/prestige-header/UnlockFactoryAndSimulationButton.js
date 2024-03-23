export default {
  name: "UnlockFactoryAndSimulationButton",
  data() {
    return {
      canUnlock: false,
      allUnlocked: false,
      canConclude: false,
      first: false,
      gainedCores: new Decimal(0),
      nextCoreSC: new Decimal(0),
      simulationTime: 0
    };
  },
  computed: {
    classObject() {
      return {
        "c-simulation-button--unlocked": this.canUnlock || this.allUnlocked,
        "c-simulation-button--locked": !this.canUnlock && !this.allUnlocked,
        "c-simulation-button--cannot-conclude": !this.canConclude && this.allUnlocked
      }
    },
    goal() {
      return Player.concludeGoal;
    },
    formatCores() {
      if (this.gainedCores.gt(0)) return `${$t("coreGained")}: ${format(this.gainedCores, 2)}`;
      return $t("noCores");
    },
    formatCoreStats() {
      if (this.gainedCores.gt(0) && this.gainedCores.lt(100)) {
        return `(${$t("nextAt")} ${quantify($t("sc"), this.nextCoreSC, 2)})`;
      }
      if (this.gainedCores.lt(Number.MAX_VALUE)) {
        return `(${format(this.gainedCores.divide(this.simulationTime), 2, 2)} ${$t("crd")}/${$t("min")})`;
      }
      return "";
    }
  },
  methods: {
    update() {
      this.gainedCores = gainedCores();
      this.nextCoreSC = this.coreToSC(this.gainedCores.add(1));
      this.simulationTime = Time.thisSimulationRealTime.totalMinutes;
      this.first = !PlayerProgress.simulationUnlocked();
      this.canConclude = Player.canConclude;
      this.allUnlocked = this.canConclude || Factory(8)
        .isUnlocked;
      if (!this.allUnlocked) {
        const next = Factories.next();
        this.canUnlock = next.canUnlock;
        this.cost = next.moneyRequirement;
      } else {
        this.canUnlock = false;
      }
    },
    unlock() {
      if (!this.allUnlocked) {
        Factories.next()
          .unlock();
      } else {
        manualConcludeSimulationRequest();
      }
    },
    coreToSC(cores) {
      const adjusted = cores.div(GameCache.totalCoresMult.value);
      return Decimal.pow10((adjusted.log(5) + 0.609324) * 500);
    }
  },
  template: `
  <div class="l-simulation-button">
    <button
      class="c-simulation-button infotooltip"
      :class="classObject"
      @click="unlock"
    >
      <div class="l-simulation-button__contents">
        
        <template v-if="first && canConclude">
          {{ $t("firstSimulation") }}
        </template>
        
        <template v-else-if="canConclude">
          <div class="c-simulation-button__header">
            {{ $t("concludeSimulation") }}
          </div>
          <div>{{ formatCores }} {{ formatCoreStats }}</div>
        </template>
        
        <template v-else-if="allUnlocked">
          {{ $t("reach") }} {{ format(goal, 2) }}
          <br>
          {{ pluralize($t("sc"), goal) }}
        </template>
        
        <template v-else-if="canUnlock">
          {{ $t("newFactory") }}
        </template>
        
        <template v-else>
          {{ $t("reach") }} {{ quantify($t("money"), cost, 2, 3)}}
          <br>
          {{ $t("toUnlockFactory") }}
        </template>
      </div>
    </button>
  </div>
  `
}