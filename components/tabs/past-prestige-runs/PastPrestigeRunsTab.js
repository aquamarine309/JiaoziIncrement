import PastPrestigeRunsContainer from "./PastPrestigeRunsContainer.js";

export default {
name: "PastPrestigeRunsTab",
components: {
PastPrestigeRunsContainer
},
data() {
return {
layers: {
steamer: {
name: "蒸笼",
id: "steamer",
plural: "蒸笼",
currency: "蒸笼币",
condition: () => PlayerProgress.steamerUnlocked(),
getRuns: () => player.records.recentSteamer,
},
infinity: {
name: "收集重置",
id: "bigReset",
plural: "收集重置",
currency: "收集饺子",
condition: () => PlayerProgress.collectionUnlocked(),
getRuns: () => player.records.recentBigReset,
},
},
resourceType: false,
};
},
computed: {
resourceText() {
switch (this.resourceType) {
case RECENT_PRESTIGE_RESOURCE.ABSOLUTE_GAIN:
return "获得的资源";
case RECENT_PRESTIGE_RESOURCE.RATE:
return "资源获得率";
case RECENT_PRESTIGE_RESOURCE.CURRENCY:
return "重置货币";
case RECENT_PRESTIGE_RESOURCE.PRESTIGE_COUNT:
return "重置次数";
default:
throw new Error("Unrecognized Statistics tab resource type");
}
}
},
methods: {
update() {
this.resourceType = player.options.statTabResources;
},
cycleButton() {
const stateCount = Object.keys(RECENT_PRESTIGE_RESOURCE).length;
player.options.statTabResources = (player.options.statTabResources + 1) % stateCount;
},
},
template: `<div class="c-stats-tab">
<div class="c-subtab-option-container">
<button
class="o-primary-btn o-primary-btn--subtab-option"
@click="cycleButton()"
>
显示{{ resourceText }}
</button>
</div>
<PastPrestigeRunsContainer
v-for="layer in layers"
:key="layer.name"
:layer="layer"
/>
</div>`
}