import ExpandingControlBox from "../../ExpandingControlBox.js";
import OpenModalHotkeysButton from "../../OpenModalHotkeysButton.js";
import OptionsButton from "../../OptionsButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";
import SelectNotationDropdown from "./SelectNotationDropdown.js";
import SelectThemeDropdown from "./SelectThemeDropdown.js";
import SelectSidebarDropdown from "./SelectSidebarDropdown.js";
import UpdateRateSlider from "./UpdateRateSlider.js";

export default {
  name: "OptionsVisualTab",
  components: {
    UpdateRateSlider,
    PrimaryToggleButton,
    ExpandingControlBox,
    OptionsButton,
    OpenModalHotkeysButton,
    SelectThemeDropdown,
    SelectNotationDropdown,
    SelectSidebarDropdown
  },
  data() {
    return {
      theme: "",
      notation: "",
      sidebarResource: "",
      headerTextColored: true,
      displayHotkeys: true,
      language: ""
    };
  },
  computed: {
    sidebarDB: () => GameDatabase.sidebarResources,
    languageLabel() {
      return `${$t("language")}: ${this.language}`
    },
    themeLabel() {
      return `${$t("theme")}: ${Themes.find(this.theme).displayName()}`;
    },
    notationLabel() {
      return `${$t("notation")}: ${this.notation}`;
    },
    sidebarLabel() {
      return `${$t("sidebar")}: ${this.sidebarResource}`;
    },
  },
  watch: {
    headerTextColored(newValue) {
      player.options.headerTextColored = newValue;
    },
    displayHotkeys(newValue) {
      player.options.displayHotkeys = newValue
    }
  },
  methods: {
    update() {
      const options = player.options;
      this.theme = Theme.currentName();
      this.notation = options.notation;
      this.language = Languages.current.formattedName;
      this.sidebarResource = player.options.sidebarResourceID === 0 ? $t("lastestResource") : $t(this.sidebarDB.find(e => e.id === player.options.sidebarResourceID)
        .optionName);
      this.headerTextColored = options.headerTextColored;
    },
  },
  template: `
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="GameOptions.toggleLanguage()"
        >
          {{ languageLabel }}
        </OptionsButton>
        <UpdateRateSlider />
      </div>
      <div class="l-options-grid__row">
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="themeLabel"
        >
          <template #dropdown>
            <SelectThemeDropdown />
          </template>
        </ExpandingControlBox>
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="notationLabel"
        >
          <template #dropdown>
            <SelectNotationDropdown />
          </template>
        </ExpandingControlBox>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.notation.show();"
        >
          {{ $t("openExpOptions") }}
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.animationOptions.show();"
        >
          {{ $t("openAnimationOptions") }}
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.infoDisplayOptions.show()"
        >
          {{ $t("openInfoDisplayOptions") }}
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.awayProgressOptions.show()"
        >
          {{ $t("openAwayProgressOptions") }}
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.hiddenTabs.show()"
        >
          {{ $t("modifyVisibleTabs") }}
        </OptionsButton>
        <PrimaryToggleButton
          v-model="headerTextColored"
          class="o-primary-btn--option l-options-grid__button"
          :label="$t('relativeColor')"
        />
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="sidebarLabel"
        >
          <template #dropdown>
            <SelectSidebarDropdown />
          </template>
        </ExpandingControlBox>
      </div>
      <OpenModalHotkeysButton />
    </div>
  </div>
  `
}