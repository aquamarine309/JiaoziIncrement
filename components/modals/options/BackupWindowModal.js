import BackupEntry from "./BackupEntry.js";
import ModalWrapper from "../ModalWrapper.js";
import PrimaryButton from "../../PrimaryButton.js";

import { AutoBackupSlots } from "../../../core/storage/index.js";

export default {
  name: "BackupWindowModal",
  components: {
    ModalWrapper,
    BackupEntry,
    PrimaryButton
  },
  data() {
    return {
      // Used to force a key-swap whenever a save happens, to make unused slots immediately update
      nextSave: 0,
      ignoreOffline: false,
    };
  },
  computed: {
    backupSlots: () => AutoBackupSlots,
    deleteText: () => "clearing your browser cookies",
  },
  watch: {
    ignoreOffline(newValue) {
      player.options.loadBackupWithoutOffline = newValue;
    },
  },
  methods: {
    update() {
      this.nextSave = Object.values(GameStorage.lastBackupTimes).map(t => t && t.backupTimer).sum();
      this.ignoreOffline = player.options.loadBackupWithoutOffline;
    },
    offlineOptionClass() {
      return {
        "c-modal__confirmation-toggle__checkbox": true,
        "c-modal__confirmation-toggle__checkbox--active": this.ignoreOffline
      };
    },
    toggleOffline() {
      this.ignoreOffline = !this.ignoreOffline;
    },
    importAsFile(event) {
      // This happens if the file dialog is canceled instead of a file being selected
      if (event.target.files.length === 0) return;

      const reader = new FileReader();
      reader.onload = function() {
        GameStorage.importBackupsFromFile(reader.result);
      };
      reader.readAsText(event.target.files[0]);
    },
  },
  template: `<ModalWrapper>
<template #header>
自动备份存档
</template>
<div class="c-info c-modal--short">
游戏会根据您在线或离线花费的时间进行自动备份。
在线备份的计时器仅在游戏打开时运行，离线备份仅保存到备份槽
具有最长的适用定时器。
此外，每当加载此处的备份时，您当前保存的内容都会保存到最后一个中。
<div
class="c-modal__confirmation-toggle"
@click="toggleOffline"
>
<div :class="offlineOptionClass()">
<span
v-if="ignoreOffline"
class="fas fa-check"
/>
</div>
<span class="c-modal__confirmation-toggle__text">
Load with offline progress disabled
</span>
</div>
<div class="c-entry-container">
<BackupEntry
v-for="slot in backupSlots"
:key="nextSave + slot.id"
class="l-backup-entry"
:slot-data="slot"
/>
</div>
These backups are still stored in the same place as your game save and can still be lost if you do anything
external to the game which would delete your save itself, such as {{ deleteText }}. You can import/export
all backups at once as files, using these buttons:
<div class="c-backup-file-ops">
<PrimaryButton
class="o-btn-file-ops"
onclick="GameStorage.exportBackupsAsFile()"
>
Export as file
</PrimaryButton>
<PrimaryButton class="o-btn-file-ops">
<input
class="c-file-import"
type="file"
accept=".txt"
@change="importAsFile"
>
<label for="file">Import from file</label>
</PrimaryButton>
</div>
Each of your three save slots has its own separate set of backups.
</div>
</ModalWrapper>`
}