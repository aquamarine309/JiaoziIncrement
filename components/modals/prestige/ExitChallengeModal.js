import ModalWrapperChoice from "../ModalWrapperChoice.js";

export default {
name: "ExitChallengeModal",
components: {
ModalWrapperChoice
},
props: {
challengeName: {
type: String,
required: true,
},
normalName: {
type: String,
required: true,
},
hasHigherLayers: {
type: Boolean,
required: true,
},
exitFn: {
type: Function,
required: true,
}
},
computed: {
isRestarting() {
return player.options.retryChallenge;
}
},
methods: {
handleYesClick() {
this.exitFn();
EventHub.ui.offAll(this);
}
},
template: `<ModalWrapperChoice
option="exitChallenge"
@confirm="handleYesClick"
>
<template #header>
你正在{{ isRestarting ? "重试" : "退出" }}{{ challengeName }}
</template>

<div class="c-modal-message__text">
<span v-if="isRestarting">
当你确认后，你将立刻重新开始{{ challengeName }}。
</span>
<span v-else>
你将回到正常的游戏中{{ normalName }}。
</span>
</div>
<template #confirm-text>
{{ isRestarting ? "重试" : "退出" }}
</template>
</ModalWrapperChoice>`
}