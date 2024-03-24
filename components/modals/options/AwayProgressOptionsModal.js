import AwayProgressOptionsEntry from "./AwayProgressOptionsEntry.js";
import ModalWrapperOptions from "./ModalWrapperOptions.js";

export default {
  name: "AwayProgressOptionsModal",
  components: {
    AwayProgressOptionsEntry,
    ModalWrapperOptions,
  },
  computed: {
    all() {
      return AwayProgressTypes.showOption;
    },
    note() {
      return $t("awayProgressNote");
    }
  },
  template: `
  <ModalWrapperOptions class="l-wrapper-apom">
    <template #header>
      {{ $t("awayProgressOptions") }}
    </template>
    <div class="c-modal-options__button-container">
      <AwayProgressOptionsEntry
        v-for="name of all"
        :key="name"
        :name="name"
      />
    </div>
    {{ note }}
  </ModalWrapperOptions>
  `
}