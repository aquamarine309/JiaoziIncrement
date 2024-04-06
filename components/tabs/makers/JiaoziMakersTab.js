import JiaoziMakersRow from './JiaoziMakersRow.js'
import BaoJiaoZaButton from './BaoJiaoZaButton.js'
import MakerTabHeader from './MakerTabHeader.js'
import WrapperButton from './WrapperButton.js'
import StuffingButton from './StuffingButton.js'
import ProgressBar from "./ProgressBar.js"

export default {
  name: 'JiaoziMakerTab',
  components: {
    JiaoziMakersRow,
    BaoJiaoZaButton,
    MakerTabHeader,
    WrapperButton,
    StuffingButton,
    ProgressBar
  },
  data() {
    return {
      maxTier: 0
    }
  },
  methods: {
    update() {
      let maxTier = 0
      if (PlayerProgress.collectionUnlocked()) maxTier += 4;
      if (PlayerProgress.steamerUnlocked()) maxTier += 1;
      if (PlayerProgress.hasBroken()) maxTier += 4;
      this.maxTier = Math.max(maxTier, Makers.maxTier);
    }
  },
  template: `
    <div>
      <MakerTabHeader />
      <BaoJiaoZaButton />
      <div
      class='o-makers-container'
      >
        <JiaoziMakersRow
        v-for='tier in maxTier'
        :key='tier'
        :tier='tier' />
      </div>
      <div
      class='o-jiaozi-prestige-container'
      >
        <WrapperButton />
        <StuffingButton />
      </div>
      <ProgressBar />
    </div>
  `
}