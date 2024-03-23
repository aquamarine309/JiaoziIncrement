import ModalWrapperChoice from "./ModalWrapperChoice.js";

export default {
name: "BreakInfinityModal",
components: {
ModalWrapperChoice
},
computed: {
message() {
return `你可以拥有超过${format(Number.MAX_VALUE)}个饺子！`
},
},
methods: {
handleYesClick() {
breakInfinity();
}
},
template: `<ModalWrapperChoice
:show-cancel="false"
@confirm="handleYesClick"
>
<template #header>
你正在扩展蒸笼
</template>
<div class="c-modal-message__text">
<span>
{{ message }}
</span>
</div>
<template #confirm-text>
扩展
</template>
</ModalWrapperChoice>`
}