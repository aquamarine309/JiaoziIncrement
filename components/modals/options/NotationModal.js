import { ADNotations } from "../../../modules/notations.js";

import ModalWrapper from "../ModalWrapper.js";
import SliderComponent from "../../SliderComponent.js";

export default {
  name: "NotationModal",
  components: {
    ModalWrapper,
    SliderComponent
  },
  data() {
    return {
      commaDigits: 0,
      notationDigits: 0,
    };
  },
  computed: {
    sampleNums() {
      const largestExponent = "123456789012345";
      const numbers = [];
      for (let digits = 4; digits < 16; digits++) numbers.push(Decimal.pow10(largestExponent.substring(0, digits)));
      return numbers;
    },
    sliderProps() {
      return {
        min: 3,
        max: 15,
        interval: 1,
        width: "100%",
        tooltip: false
      };
    },
  },
  watch: {
    commaDigits(newValue) {
      player.options.notationDigits.comma = newValue;
      ADNotations.Settings.exponentCommas.min = 10 ** newValue;
    },
    notationDigits(newValue) {
      player.options.notationDigits.notation = newValue;
      ADNotations.Settings.exponentCommas.max = 10 ** newValue;
    },
  },
  // This puts the sliders in the right spots on initialization
  created() {
    const options = player.options.notationDigits;
    this.commaDigits = options.comma;
    this.notationDigits = options.notation;
  },
  methods: {
    update() {
      const options = player.options.notationDigits;
      this.commaDigits = options.comma;
      this.notationDigits = options.notation;
    },

    // These need a bit of extra logic to ensure that the notation threshold is always >= the comma threshold
    adjustSliderComma(value) {
      this.commaDigits = value;
      player.options.notationDigits.comma = value;
      if (value > this.notationDigits) this.adjustSliderNotation(value);
    },
    adjustSliderNotation(value) {
      this.notationDigits = value;
      player.options.notationDigits.notation = value;
      if (value < this.commaDigits) this.adjustSliderComma(value);
    }
  },
  template: `
  <ModalWrapper>
    <template #header>
      指数计数法设置
    </template>
    当数字非常大时，你可以调整数字的外观。如果数值很小，则指数将直接显示，而不用其他格式。为了清晰起见，较大的值会在指数中插入逗号，巨大的值会把指数变为二重指数以缩短指数的长度。你可以在以下区域之间调整两个阈值:
    <br>
    <br>
    <div class="c-single-slider">
      <b class="o-digit-text">指数中逗号的最小值: {{ formatInt(commaDigits) }} 位</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="commaDigits"
        @input="adjustSliderComma($event)"
      />
    </div>
    <div class="c-single-slider">
      <b class="o-digit-text">最大指数位数: {{ formatInt(notationDigits) }} 位</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="notationDigits"
        @input="adjustSliderNotation($event)"
      />
    </div>
    <br>
    一些测试的数字:
    <div class="c-sample-numbers">
      <span
        v-for="(num, id) in sampleNums"
        :key="id"
        class="o-single-number"
      >
        {{ formatPostBreak(num) }}
      </span>
    </div>
    <br>
    注：该界面通常针对科学计数法进行了优化，设置为{{ formatInt(5) }}位数和{{ formatInt(9) }}位数。如果你设置的值与这些值有显著差异，某些文本可能看起来很奇怪或超出框的范围。此外，当使用某些计数法时，这些设置可能不会导致任何视觉变化。
  </ModalWrapper>
  `
}