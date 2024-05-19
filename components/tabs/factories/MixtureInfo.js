export default {
  name: "MixtureInfo",
  props: {
    mixture: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      effectValue: 0
    }
  },
  computed: {
    name() {
      return $t(this.mixture.name);
    },
    purpose() {
      return $t(this.mixture.purpose);
    },
    effectStyle() {
      if (!this.mixture.className) return;
      return `o-mixture-type__${this.mixture.className}`;
    }
  },
  methods: {
    update() {
      this.effectValue = this.mixture.effectValue;
    }
  },
  template: `
  <p>
    {{ $t("mixtureInfo", [name, purpose]) }}
    <span
      class="o-mixture-type__accent"
      :class="effectStyle"
    >
      {{ formatX( effectValue, 2, 3) }}
    </span>
  </p>
  `
}