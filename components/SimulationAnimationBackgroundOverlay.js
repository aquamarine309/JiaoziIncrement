import ConcludeSimulationButton from "./ConcludeSimulationButton.js";

export default {
  name: "SimulationAnimationBackgroundOverlay",
  components: {
    ConcludeSimulationButton
  },
  computed: {
    errors() {
      return SimulationAnimation.errors;
    }
  },
  data() {
    return {
      activeAmount: 0,
      opacity: 0,
      showBtn: false
    }
  },
  methods: {
    update() {
      const state = SimulationAnimation.state;
      this.activeAmount = Math.min(Math.floor(state), this.errors.length);
      this.opacity = Math.min(1.2 * state, 1);
      this.showBtn = state > 100;
    }
  },
  template: `
  <div
  class="c-background-overlay"
  :style="{ opacity }"
  >
    <div
    class="o-simulation-animation-overlay"
    >
      <div
      v-for="(error, index) in errors"
      v-if="index <= activeAmount - 1"
      :key="index"
      >
        <i class="fas fa-exclamation-triangle" />
        未知错误: 未找到 {{ error }}
      </div>
    </div>
    <div
    class="o-conclude-simulation-btn--container"
    v-if="showBtn"
    >
      <ConcludeSimulationButton />
    </div>
  </div>
  `
}