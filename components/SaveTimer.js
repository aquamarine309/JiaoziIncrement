export default {
  name: "SaveTimer",
  data() {
    return {
      currentTime: 0,
      lastLocalSave: 0,
      showTimeSinceSave: false,
      saveDisabled: false,
    };
  },
  computed: {
    timeString() {
      return timeDisplayShort(this.currentTime - this.lastLocalSave);
    },
  },
  methods: {
    update() {
      this.currentTime = Date.now();
      this.lastLocalSave = GameStorage.lastSaveTime;
      this.showTimeSinceSave = player.options.showTimeSinceSave;
      this.saveDisabled = false
    },
    save() {
      GameStorage.save(false, true);
    }
  },
  template: `<div
v-if="showTimeSinceSave"
class="o-save-timer"
@click="save"
>
<b v-if="saveDisabled">{{ $t("autoSaveDisabled") }}</b>
<span v-else>{{ $t("timeSinceSave") }}: {{ timeString }}</span>
</div>`
}