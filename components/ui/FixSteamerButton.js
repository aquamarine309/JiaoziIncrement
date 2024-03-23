export default {
  name: "FixSteamerButton",
  data() {
    return {
      smallSteamer: false,
      shouldDisplay: false
    };
  },
  methods: {
    update() {
      this.shouldDisplay = !player.break && Player.canFixSteamer;
      if (!this.shouldDisplay) return;
      this.smallSteamer = Time.bestSteamerRealTime.totalMinutes <= 1;
    },
    handleClick() {
      if (PlayerProgress.steamerUnlocked()) manualSteamerRequest();
      else Modal.steamer.show();
    }
  },
  template: `
    <span v-if="shouldDisplay">
      <div>
        <h3
        v-if="!smallSteamer"
        class="l-spacing"
        > 
          {{ $t("steamerInfo") }}
        </h3>
        <button
        :class="{
        'btn-fix-steamer': true,
        'btn-fix-steamer--small': smallSteamer
        }"
        @click="handleClick"
        >
          {{ $t("fixSteamer") }}
        </button>
      </div>
    </span>`
}