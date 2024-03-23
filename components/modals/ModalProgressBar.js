import OfflineSpeedupButton from "../OfflineSpeedupButton.js";

export default {
  name: "ModalProgressBar",
  components: {
    OfflineSpeedupButton,
  },
  computed: {
    progress() {
      return this.$viewModel.modal.progressBar;
    },
    foregroundStyle() {
      return {
        width: `${this.progress.current / this.progress.max * 100}%`,
      };
    },
    remainingTime() {
      const timeSinceStart = Date.now() - this.progress.startTime;
      const ms = timeSinceStart * (this.progress.max - this.progress.current) / this.progress.current;
      return TimeSpan.fromMilliseconds(ms).toStringShort();
    },
    buttons() {
      return this.progress.buttons || [];
    },
    classObj() {
      return {
        "c-modal": true,
        "c-modal--simulation": PlayerProgress.simulationUnlocked()
      }
    }
  },
  template: `
  <div
    class="l-modal-overlay c-modal-overlay progress-bar-modal"
  >
    <div :class="classObj">
      <div class="modal-progress-bar">
        <div class="modal-progress-bar__label">
          {{ $t(progress.label) }}
        </div>
        <div>
          {{ progress.info() }}
        </div>
        <div class="modal-progress-bar__margin">
          <div>
            {{ $t(progress.progressName, null, true) }}: {{ formatInt(progress.current) }}/{{ formatInt(progress.max) }}
          </div>
          <div>
            {{ $t("remaining") }}: {{ remainingTime }}
          </div>
          <div class="modal-progress-bar__hbox">
            <div class="modal-progress-bar__bg">
              <div
                class="modal-progress-bar__fg"
                :style="foregroundStyle"
              />
            </div>
          </div>
        </div>
        <div class="modal-progress-bar__buttons">
          <OfflineSpeedupButton
            v-for="(button, id) in buttons"
            :key="id"
            :button="button"
            :progress="progress"
          />
        </div>
      </div>
    </div>
  </div>
  `
}