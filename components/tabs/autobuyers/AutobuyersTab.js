import AutobuyerToggles from "./AutobuyerToggles.js";
import SaleAutobuyerBox from "./SaleAutobuyerBox.js";
import MakerAutobuyerBox from "./MakerAutobuyerBox.js";
import OpenModalHotkeysButton from "../../OpenModalHotkeysButton.js";
import SimpleAutobuyersMultiBox from "./SimpleAutobuyersMultiBox.js";
import WrapperAutobuyerBox from "./WrapperAutobuyerBox.js";
import StuffingAutobuyerBox from "./StuffingAutobuyerBox.js";
import BigResetAutobuyerBox from "./BigResetAutobuyerBox.js"
import SteamerAutobuyerBox from "./SteamerAutobuyerBox.js"

export default {
  name: "AutobuyersTab",
  components: {
    AutobuyerToggles,
    OpenModalHotkeysButton,
    SaleAutobuyerBox,
    WrapperAutobuyerBox,
    MakerAutobuyerBox,
    SimpleAutobuyersMultiBox,
    StuffingAutobuyerBox,
    BigResetAutobuyerBox,
    SteamerAutobuyerBox
  },
  data() {
    return {
      hasBigReset: false,
      hasContinuum: false,
      displayMakerAutobuyersIndividually: false,
      hasInstant: false,
    };
  },
  computed: {
    // It only makes sense to show this if the player has seen gamespeed-altering effects, but we should keep it there
    // permanently as soon as they have
    hasSeenGamespeedAlteringEffects() {
      return false//PlayerProgress.seenAlteredSpeed();
    },
    gameTickLength() {
      return `${formatInt(player.options.updateRate)} 毫秒`;
    }
  },
  methods: {
    update() {
      this.hasBigReset = PlayerProgress.collectionUnlocked();
      this.hasContinuum = false;
      this.checkMakerAutoStatus();
    },
    checkMakerAutoStatus() {
      const maker = Autobuyer.maker;
      this.hasInstant = maker.hasInstant;
      this.displayMakerAutobuyersIndividually = !maker.collapseDisplay;
    },
  },
  template: `
  <div class="l-autobuyers-tab">
    <AutobuyerToggles />
    <OpenModalHotkeysButton />
    <div v-if="hasSeenGamespeedAlteringEffects">
      Autobuyer intervals and time-based settings are always <b>real time</b> and therefore
      <br>
      unaffected by anything which may alter how fast the game itself is running.
      <br>
      <br>
    </div>
    <SteamerAutobuyerBox class="c-stamer-pos" />
    <BigResetAutobuyerBox class="c-big-reset-pos" />
    <SaleAutobuyerBox class="c-sale-pos" />
    <WrapperAutobuyerBox />
    <StuffingAutobuyerBox />
    <template v-if="displayMakerAutobuyersIndividually">
      <MakerAutobuyerBox
        v-for="tier in 9"
        :key="tier"
        :tier="tier"
      />
    </template>
    <SimpleAutobuyersMultiBox />
  </div>
  `
}