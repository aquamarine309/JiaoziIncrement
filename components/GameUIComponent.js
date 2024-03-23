import Ui from './ui/Ui.js'
import GameUiComponentFixed from './GameUiComponentFixed.js'
import TabComponents from './tabs/index.js'
import BackgroundAnimations from "./BackgroundAnimations.js";

export default {
  name: 'GameUIComponent',
  components: {
    Ui,
    GameUiComponentFixed,
    BackgroundAnimations,
    ...TabComponents
  },
  data() {
    return {
      jiaozi: new Decimal(0)
    }
  },
  methods: {
    update() {
      this.jiaozi = player.jiaozi
    }
  },
  computed: {
    view() {
      return this.$viewModel
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `stylesheets/theme-${this.view.theme}.css`;
    }
  },
  template: `
    <div
    v-if="view.initialized"
    id='ui-container'
    >
      <div
      id="ui"
      class="c-game-ui"
      >
        <Ui>
          <component
          :is="page"
          class="c-game-tab"
          />
        </Ui>
        <link
        v-if="view.theme !== 'Normal'"
        type="text/css"
        rel="stylesheet"
        :href="themeCss"
        >
      </div>
    <GameUiComponentFixed />
    <BackgroundAnimations />
    </div>
  `
}