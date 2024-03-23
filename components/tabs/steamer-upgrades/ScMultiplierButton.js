import SteamerUpgradeButton from "./SteamerUpgradeButton.js";
import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
name: "ScMultiplierButton",
components: {
PrimaryButton,
PrimaryToggleButton,
SteamerUpgradeButton
},
data() {
return {
isAutobuyerActive: false,
isAutoUnlocked: false,
isCapped: false
};
},
computed: {
upgrade() {
return SteamerUpgrade.coinMult;
}
},
watch: {
isAutobuyerActive(newValue) {
Autobuyer.scMult.isActive = newValue;
}
},
methods: {
update() {
this.isAutoUnlocked = Autobuyer.scMult.isUnlocked;
this.isAutobuyerActive = Autobuyer.scMult.isActive;
this.isCapped = this.upgrade.isCapped;
},
buyMaxSCMult() {
SteamerUpgrade.coinMult.buyMax();
}
},
template: `<div class="l-spoon-btn-group">
<SteamerUpgradeButton
:upgrade="upgrade"
class="o-steamer-upgrade-btn--multiplier"
>
<template v-if="isCapped">
<br>
<span>{{ $t("scCappedAt", [quantify("sc", upgrade.config.costCap)]) }}</span>
</template>
</SteamerUpgradeButton>
<PrimaryButton
class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
@click="buyMaxSCMult()"
>
{{ $t("maxSCmult") }}
</PrimaryButton>
<PrimaryToggleButton
v-if="isAutoUnlocked"
v-model="isAutobuyerActive"
:label="$t('autoScMult')"
class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
/>
</div>`
}