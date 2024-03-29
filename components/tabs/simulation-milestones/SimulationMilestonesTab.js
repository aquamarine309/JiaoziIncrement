import SimulationMilestoneSingle from "./SimulationMilestoneSingle.js";

export default {
  name: "SimulationMilestonesTab",
  components: {
    SimulationMilestoneSingle
  },
  computed: {
    milestones() {
      return SimulationMilestone.all
    }
  },
  template: `
    <div class="o-simulation-milestones-tab">
      <h1 class="o-simulation-milestones-tab--title">
        {{ $t("simulationMilestone", [], true) }}
      </h1>
      <SimulationMilestoneSingle
      v-for="milestone in milestones"
      :milestone="milestone"
      :key="milestone.id"
      />
    </div>
  `
}