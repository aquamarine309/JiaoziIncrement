import HeaderPrestigeGroup from "./HeaderPrestigeGroup.js"
import FixSteamerButton from "./FixSteamerButton.js"
import HeaderChallengeDisplay from "./HeaderChallengeDisplay.js";

export default {
  name: "Ui",
  components: {
    HeaderPrestigeGroup,
    FixSteamerButton,
    HeaderChallengeDisplay
  },
  data() {
    return {
      fixSteamer: false
    }
  },
  methods: {
    update() {
      this.fixSteamer = Player.canFixSteamer && !player.break && Time.bestSteamerRealTime.totalMinutes > 1
    }
  },
  template: `
    <div id='page'>
      <div
      class="game-container"
      style="margin-top: 3.9rem"
      >
        <FixSteamerButton />
        <div
        class='tab-container'
        v-if='!fixSteamer'
        >
          <HeaderPrestigeGroup />
          <div class="information-header" >
            <HeaderChallengeDisplay />
          </div>
        <slot />
        </div>
      </div>
    </div>
  `
}