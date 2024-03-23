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
    <h3>存档 #{{ saveId + 1 }}:<span v-if="isSelected"> (已选中)</span></h3>
    <span v-if="fileName">存档名称: {{ fileName }}</span>
    <span>饺子: {{ formatJiaozi(jiaozi) }}</span>
    <PrimaryButton
    class="o-primary-btn--width-medium"
    @click="load"
    >
      加载
    </PrimaryButton>
  </div>`
}