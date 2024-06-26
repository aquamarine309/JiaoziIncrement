import SecretAchievementRow from "./SecretAchievementRow.js";

export default {
  name: "SecretAchievementsTab",
  components: {
    SecretAchievementRow
  },
  computed: {
    rows: () => SecretAchievements.allRows,
  },
  template: `
  <div class="l-achievements-tab">
    <div class="l-achievement-grid">
      <secret-achievement-row
        v-for="(row, i) in rows"
        :key="i"
        :row="row"
      />
    </div>
  </div>
  `
}