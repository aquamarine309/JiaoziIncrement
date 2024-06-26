export default {
name: "ChallengeGridCell",
props: {
challenge: {
type: Object,
required: true
},
isChallengeVisible: {
type: Function,
required: true
}
},
data() {
return {
isVisible: false
};
},
methods: {
update() {
this.isVisible = this.isChallengeVisible(this.challenge);
}
},
template: `<div
v-show="isVisible"
class="l-challenge-grid__cell"
>
<slot />
</div>`
}