import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer.js";
import HeaderSteamerContainer from "./prestige-header/HeaderSteamerContainer.js";
import HeaderBigResetContainer from "./prestige-header/HeaderBigResetContainer.js"

export default {
name: "HeaderPrestigeGroup",
components: {
HeaderCenterContainer,
HeaderSteamerContainer,
HeaderBigResetContainer
},
template: `<div class="c-prestige-info-blocks">
<HeaderSteamerContainer class="l-game-header__steamer" />
<HeaderCenterContainer class="l-game-header__center" />
<HeaderBigResetContainer class="l-game-header__big-reset" />
</div>`
}
