export default {
  name: "ConcludeSimulationButton",
  methods: {
    concludeSimulation() {
      concludeSimulationRequest(false);
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