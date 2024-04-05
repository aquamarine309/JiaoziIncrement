export default {
  name: "ConcludeSimulationButton",
  methods: {
    concludeSimulation() {
      concludeSimulationReset();
    }
  },
  template: `
    <button
    class="o-conclude-simulation-btn"
    @click="concludeSimulation"
    >
      终止模拟
    </button>
  `
}