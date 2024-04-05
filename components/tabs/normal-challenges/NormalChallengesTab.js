import NormalChallengeBox from "./NormalChallengeBox.js"
import ChallengeGrid from "../../ChallengeGrid.js";
import ChallengeTabHeader from "../../ChallengeTabHeader.js";
import { DC } from "../../../core/constants.js";

export default {
  name: "NormalChallengesTab",
  components: {
    NormalChallengeBox,
    ChallengeGrid,
    ChallengeTabHeader
  },
  data() {
    return {
      isUnlocked: false
    }
  },
  methods: {
    update() {
      this.isUnlocked = player.records.thisSimulation.maxJiaozi.gte(this.unlockRequirement) || SimulationMilestone.qols.isReached;
    }
  },
  computed: {
    challenges() {
      return NormalChallenges.all
    },
    unlockRequirement() {
      return NormalChallenges.requirement;
    }
  },
  template: `
  <div class="l-challenges-tab">
    <div v-if="!isUnlocked">
      {{ $t("unlockChallenge", [format(unlockRequirement)]) }}
    </div>
    <div v-else>
     <ChallengeTabHeader />
     <p>
      {{ $t("noDCinfo") }}
     </p>
      <ChallengeGrid
        v-slot="{ challenge }"
        :challenges="challenges"
        :is-challenge-visible="() => isUnlocked"
      >
        <NormalChallengeBox :challenge="challenge" />
      </ChallengeGrid>
    </div>
  </div>
  `
}