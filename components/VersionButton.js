export default {
  computed: {
    version() {
      return `r${Player.defaultStart.version}`
    }
  },
  methods: {
    checkUpdate() {
      checkUpdate();
    }
  },
  template: `
  <div
    class="o-version-btn"
    @click="checkUpdate"
  >
    <span>{{ $t("version") }}: {{ version }}</span>
</div>
  `
}