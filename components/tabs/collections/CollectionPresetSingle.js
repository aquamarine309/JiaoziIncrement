import CollectionSetPreview from "../../CollectionSetPreview.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "CollectionPresetSingle",
  components: {
    CollectionSetPreview,
    PrimaryButton
  },
  props: {
    preset: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      displayName: "",
      actualName: "",
      isSet: false,
      activeBits: 0,
      isFocused: false,
      isValid: false
    }
  },
  methods: {
    update() {
      this.updatePresets();
      if (!this.isSet) return;
      this.activeBits = this.preset?.activeBits;
      if (this.isFocused) return;
      this.updateActualValue();
    },
    updateActualValue() {
      const actualName = this.preset.name;
      if (this.actualName === actualName) return;
      this.actualName = actualName;
      this.displayName = actualName;
    },
    handleInput(event) {
      const input = event.target.value.trim();
      this.displayName = input;
      if (input.length === 0) {
        this.isValid = false;
        return;
      }
      this.isValid = true;
      this.actualName = input;
    },
    handleFocus() {
      this.isFocused = true
    },
    handleChange(event) {
      if (this.isValid) {
        this.preset.rename(this.actualName);
      } else {
        this.updateActualValue()
      }
      this.displayName = this.actualName;
      this.isValid = true;

      this.isFocused = false;
      event.target.blur();
    },
    save() {
      this.preset.save();
    },
    load() {
      //slient: false.
      this.preset.load(false);
    },
    deletePreset() {
      CollectionPresets.delete(this.preset);
    },
    createPreset() {
      if (this.isSet) return;
      CollectionPresets.add();
    },
    updatePresets() {
      this.isSet = this.preset !== undefined;
    }
  },
  computed: {
    classObject() {
      return {
        "c-collection-preset-container": true,
        "c-collection-preset-container--add": !this.isSet
      }
    }
  },
  template: `
    <div
      :class="classObject"
      @click="createPreset"
    >
      <template v-if="isSet">
      <div class="l-collection-preset-info">
        <CollectionSetPreview
          label=""
          :activeBits="activeBits"
        />
        <input
          class="o-collection-preset__name-input"
          :value="displayName"
          @change="handleChange"
          @focus="handleFocus"
          @input="handleInput"
        />
      </div>
      <div class="l-collection-preset-info--btns">
        <PrimaryButton
          @click="save"
          class="l-collection-preset-btn"
        >
          {{ $t("save") }}
        </PrimaryButton>
        <PrimaryButton
          @click="load"
          class="l-collection-preset-btn"
        >
          {{ $t("load") }}
        </PrimaryButton>
        <PrimaryButton
          @click="deletePreset"
          class="l-collection-preset-btn"
        >
          {{ $t("delete") }}
        </PrimaryButton>
      </div>
      </template>
      <template v-else>
        <i class="fas fa-square-plus" />
      </template>
    </div>
  `
}