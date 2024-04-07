export default {
  computed: {
    version() {
      return `r${Player.defaultStart.version}`
    }
  },
  template: `
  <div
class="o-version-btn"
>
<span>{{ $t("version") }}: {{ version }}</span>
</div>
  `
}