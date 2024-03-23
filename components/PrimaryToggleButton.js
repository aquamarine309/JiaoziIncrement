import PrimaryButton from "./PrimaryButton.js";

export default {
  name: "PrimaryToggleButton",
  components: {
    PrimaryButton
  },
  props: {
    label: {
      type: String,
      required: false,
      default: ""
    },
    on: {
      type: String,
      required: false,
      default: "on"
    },
    off: {
      type: String,
      required: false,
      default: "off"
    },
    value: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    displayText() {
      return `${this.label} ${this.value ? $t(this.on) : $t(this.off)}`.trim();
    }
  },
  template: `<PrimaryButton
v-bind="$attrs"
@click="emitInput(!value)"
>
{{ displayText }}
</PrimaryButton>`
}