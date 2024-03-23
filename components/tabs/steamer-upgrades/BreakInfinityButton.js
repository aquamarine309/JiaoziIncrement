export default {
name: "BreakInfinityButton",
data() {
return {
isBroken: false,
isUnlocked: false,
isEnslaved: false,
};
},
computed: {
classObject() {
return {
"o-steamer-upgrade-btn": true,
"o-steamer-upgrade-btn--color-2": true,
"o-steamer-upgrade-btn--available": this.isUnlocked,
"o-steamer-upgrade-btn--unavailable": !this.isUnlocked
};
},
text() {
return this.isBroken ? "蒸笼已扩展" : "扩展蒸笼";
}
},
methods: {
update() {
this.isBroken = player.break;
this.isUnlocked = Player.allSteamerUpgradesBought;
},
clicked() {
if (!this.isBroken && this.isUnlocked) Modal.breakInfinity.show();
}
},
template: `<button
:class="classObject"
@click="clicked"
>
{{ text }}
</button>`
}