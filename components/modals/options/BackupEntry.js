import PrimaryButton from "../../PrimaryButton.js";

import { BACKUP_SLOT_TYPE } from "../../../core/storage/index.js";

export default {
  name: "BackupEntry",
  components: {
    PrimaryButton
  },
  props: {
    slotData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currTime: 0,
    };
  },
  computed: {
    save() {
      return GameStorage.loadFromBackup(this.slotData.id);
    },
    progressStr() {
      if (!this.save) return "(空)";

      // These will be checked in order; the first nonzero resource will be returned
      const resources = [this.save.jiaozi];
      const names = ['饺子'];

      for (let index = 0; index < resources.length; index++) {
        const val = new Decimal(resources[index]);
        if (val.gt(0)) return `${names[index]}: ${formatPostBreak(val, 2)}`;
      }

      // In practice this should never happen, unless a save triggers on the same tick the very first AD1 is bought
      return "没有资源";
    },
    slotType() {
      const formattedTime = this.slotData.intervalStr?.();
      switch (this.slotData.type) {
        case BACKUP_SLOT_TYPE.ONLINE:
          return `每在线${formattedTime}时存档`;
        case BACKUP_SLOT_TYPE.OFFLINE:
          return `离线后${formattedTime}存档`;
        case BACKUP_SLOT_TYPE.RESERVE:
          return "加载前存档";
        default:
          throw new Error("Unrecognized backup save type");
      }
    },
    lastSaved() {
      const lastSave = GameStorage.lastBackupTimes[this.slotData.id]?.date ?? 0;
      return lastSave ?
        `上次存档: ${TimeSpan.fromMilliseconds(this.currTime - lastSave)} 之前` :
        "当前存档槽未使用";
    },
  },
  methods: {
    update() {
      this.currTime = Date.now();
    },
    load() {
      if (!this.save) return;
      // This seems to be the only way to properly hide the modal after the save is properly loaded,
      // since the offline progress modal appears nearly immediately after clicking the button
      Modal.hide();

      // We still save to the reserve slot even if we're loading from it, so we temporarily store the
      // save-to-be-loaded into a string in this scope so that it doesn't get overwritten by the current save
      const toLoad = this.save;
      GameStorage.saveToReserveSlot();

      GameStorage.ignoreBackupTimer = true;
      GameStorage.offlineEnabled = player.options.loadBackupWithoutOffline ? false : undefined;
      GameStorage.oldBackupTimer = player.backupTimer;
      GameStorage.loadPlayerObject(toLoad);
      GameUI.notify.info(`游戏以保存备用存档 #${this.slotData.id}`);
      GameStorage.loadBackupTimes();
      GameStorage.ignoreBackupTimer = false;
      GameStorage.offlineEnabled = undefined;
      GameStorage.resetBackupTimer();
      GameStorage.save(true);
    },
  },
  template: `<div class="c-bordered-entry">
<h3>Slot #{{ slotData.id }}:</h3>
<span>{{ progressStr }}</span>
<span>
{{ slotType }}
</span>
<span class="c-fixed-height">{{ lastSaved }}</span>
<PrimaryButton
class="o-primary-btn--width-medium"
:class="{ 'o-primary-btn--disabled' : !save }"
@click="load()"
>
加载
</PrimaryButton>
</div>`
}