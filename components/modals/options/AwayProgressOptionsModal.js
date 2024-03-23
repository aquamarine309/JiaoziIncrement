import AwayProgressOptionsEntry from "./AwayProgressOptionsEntry.js";
import ModalWrapperOptions from "./ModalWrapperOptions.js";

export default {
name: "AwayProgressOptionsModal",
components: {
AwayProgressOptionsEntry,
ModalWrapperOptions,
},
computed: {
all() {
return AwayProgressTypes.showOption;
}
},
template: `<ModalWrapperOptions class="l-wrapper-apom">
<template #header>
Away Progress Options
</template>
<div class="c-modal-options__button-container">
<AwayProgressOptionsEntry
v-for="name of all"
:key="name"
:name="name"
/>
</div>
Note: Selected resources will only show if they've increased.
</ModalWrapperOptions>`
}
