import PrimaryButton from "../PrimaryButton.js";

export default {
  name: "LoadGameEntry",
  components: {
    PrimaryButton
  },
  props: {
    saveId: {
      type: Number,
      required: true
    }
  },
  data() {
    const save = GameStorage.saves[this.saveId];
    return {
      jiaozi: new Decimal(save ? save.jiaozi : 10),
      fileName: save ? save.options.saveFileName : ""
    };
  },
  computed: {
    isSelected() {
      return GameStorage.currentSlot === this.saveId;
    },
    save() {
      return $t("save");
    },
    fileNameText() {
      return $t("fileName");
    },
    dumpling() {
      return $t("jiaozi", null, true);
    },
    loadText() {
      return $t("load");
    },
    selected() {
      return $t("selected");
    }
  },
  methods: {
    load() {
      GameStorage.loadSlot(this.saveId);
    },
    formatJiaozi(jiaozi) {
      return formatPostBreak(jiaozi, 2, 1);
    },
    update() {
      if (this.isSelected) {
        this.jiaozi.copyFrom(Currency.jiaozi);
      }
    }
  },
  template: `
  <div class="l-modal-options__save-record">
    <h3>{{ save }} #{{ saveId + 1 }}:<span v-if="isSelected"> ({{ selected }})</span></h3>
    <span v-if="fileName">{{ fileNameText }}: {{ fileName }}</span>
    <span>{{ dumpling }}: {{ formatJiaozi(jiaozi) }}</span>
    <PrimaryButton
    class="o-primary-btn--width-medium"
    @click="load"
    >
      {{ loadText }}
    </PrimaryButton>
  </div>`
}