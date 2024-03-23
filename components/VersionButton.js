export default {
  computed: {
    version() {
      return `r${player.version}`
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