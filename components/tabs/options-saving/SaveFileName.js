export default {
  name: "SaveFileName",
  components: {},
  data() {
    return {
      saveFileName: ""
    };
  },
  methods: {
    update() {
      this.saveFileName = player.options.saveFileName;
    },
    removeNotAvailableCharacters(input) {
      return input.replace(/[^a-zA-Z0-9 -]/gu, "");
    },
    handleChange(event) {
      const newName = this.removeNotAvailableCharacters(event.target.value.trim());
      player.options.saveFileName = newName;
      event.target.value = newName;
    }
  },
  template: `<div class="o-primary-btn o-primary-btn--option o-primary-btn--input l-options-grid__button">
<b>{{ $t("saveName") }}:</b>
<span :ach-tooltip="$t('setNameTooltip')">
<input
class="c-custom-save-name__input"
type="text"
maxlength="16"
:placeholder="$t('customName')"
:value="saveFileName"
@change="handleChange"
>
</span>
</div>`
}