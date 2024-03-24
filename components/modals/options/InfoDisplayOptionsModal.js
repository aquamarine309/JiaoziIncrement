import ModalOptionsToggleButton from "../../ModalOptionsToggleButton.js";
import ModalWrapperOptions from "./ModalWrapperOptions.js";

export
default {
  name: "InfoDisplayOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
  },
  data() {
    return {
      challenges: false
    };
  },
  computed: {
    fullCompletion() {
      return player.records.fullGameCompletions > 0;
    }
  },
  watch: {
    challenges(newValue) {
      player.options.showHintText.challenges = newValue;
    }
  },
  methods: {
    update() {
      const progress = PlayerProgress;
      this.hasBroken = this.fullCompletion || progress.hasBroken();

      this.challenges = player.options.showHintText.challenges;
    }
  },
  template: `
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      {{ $t("infoDisplayOptions") }}
    </template>
    <div class="c-modal-options__button-container">
      <ModalOptionsToggleButton
        v-if="hasBroken"
        v-model="challenges"
        :text="$t('challengeIds')"
      />
    </div>
    Note: All types of additional info above will always display when holding shift.
  </ModalWrapperOptions>
  `
}