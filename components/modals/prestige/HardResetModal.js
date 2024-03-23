import ModalWrapperChoice from "../ModalWrapperChoice.js";

export default {
name: "HardResetModal",
components: {
ModalWrapperChoice
},
data() {
return {
input: ""
};
},
computed: {
willHardReset() {
return this.input === "goodbye";
},
hasExtraNG() {
return player.records.fullGameCompletions > 0;
},
hasSpeedrun() {
return player.speedrun.isUnlocked;
}
},
destroyed() {},
methods: {
hardReset() {
if (this.willHardReset) GameStorage.hardReset();
this.input = "";
},
},
template: `<ModalWrapperChoice
:show-cancel="!willHardReset"
:show-confirm="willHardReset"
confirm-class="o-primary-btn--width-medium c-modal__confirm-btn c-modal-hard-reset-btn"
@confirm="hardReset"
>
<template #header>
HARD RESET
</template>
<div class="c-modal-message__text">
请确认你要硬重置这个存档。
<span class="c-modal-hard-reset-danger">删除存档后不会出现任何东西</span>
输入 "goodbye" 以确认.
<div class="c-modal-hard-reset-danger">
这将重置你的存档.
</div>
</div>
<input
ref="input"
v-model="input"
type="text"
class="c-modal-input c-modal-hard-reset__input"
@keyup.esc="emitClose"
>
<div class="c-modal-hard-reset-info">
<div
v-if="willHardReset"
class="c-modal-hard-reset-danger"
>
好的 - 你的存档将会被销毁！
</div>
<div v-else>
请输入正确的内容以硬重置！
</div>
</div>
<template #confirm-text>
重置
</template>
</ModalWrapperChoice>`
}