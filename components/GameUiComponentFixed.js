import Sidebar from './ui/Sidebar.js'
import PopupModal from "./modals/PopupModal.js";
import SaveTimer from "./SaveTimer.js"
import ModalProgressBar from './modals/ModalProgressBar.js'
import HowToPlay from "./HowToPlay.js";
import VersionButton from "./VersionButton.js"
import SimulationAnimationBackgroundOverlay from "./SimulationAnimationBackgroundOverlay.js"

export default {
  name: 'GameUiComponentFixed',
  components: {
    Sidebar,
    PopupModal,
    SaveTimer,
    ModalProgressBar,
    HowToPlay,
    VersionButton,
    SimulationAnimationBackgroundOverlay
  },
  data() {
    return {
      showBgOverlay: false
    }
  },
  methods: {
    update() {
      this.showBgOverlay = player.isSimulationAnimationActive
    }
  },
  computed: {
    view() {
      return this.$viewModel
    }
  },
  template: `
    <div
  id="ui-fixed"
  class="c-game-ui--fixed"
  >
    <div
    id="notification-container"
    class="l-notification-container"
    />
    <Sidebar />
    <SaveTimer />
    <VersionButton />
    <PopupModal
    v-if="view.modal.current"
    :modal="view.modal.current"
    />
    <ModalProgressBar v-if="view.modal.progressBar" />
    <SimulationAnimationBackgroundOverlay v-if="showBgOverlay" />
  </div>
  `
}