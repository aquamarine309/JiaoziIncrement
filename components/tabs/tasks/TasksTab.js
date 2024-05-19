import TaskEntry from "./TaskEntry.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "TasksTab",
  components: {
    TaskEntry,
    PrimaryButton
  },
  computed: {
    tasks() {
      return Task.all
    }
  },
  data() {
    return {
      isAuto: false
    }
  }, 
  methods: {
    update() {
      this.isAuto = SimulationMilestone.qols.isReached;
    },
    toggle() {
      const areEnabled = Autobuyer.task(1).isActive;
      for (let i = 1; i < 5; i++) {
        Autobuyer.task(i).isActive = !areEnabled;
      }
    }
  },
  template: `
    <div>
      <h2 class="o-tasks-title">{{ $t("takeoutOrders") }}</h2>
      <PrimaryButton
      v-if="isAuto"
      @click="toggle"
      >
        {{ $t("toggleAuto") }}
      </PrimaryButton>
      <div class="o-tasks-container">
        <TaskEntry
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        />
      </div>
    </div>
  `
}