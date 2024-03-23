import ResetModal from "./ResetModal.js";

export default {
  name: "SteamerModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedSteamerCount: new Decimal(),
      gainedSteamerCoins: new Decimal(),
      startingWrapper: 0,
      startingAM: new Decimal(10),
      startingStuffing: 0
    };
  },
  computed: {
    isFirstSteamer() {
      return !PlayerProgress.steamerUnlocked();
    },
    message() {
      const info = this.isFirstSteamer ? this.firstSteamerInfo : ``;
      return `修复蒸笼后，你将重置所有的饺子、饺子皮、饺子馅、饺子币、大重置次数和所有收集饺子。${info}`;
    },
    firstSteamerInfo() {
      return `作为回报，你将获得一个蒸笼币(SC)。它可以用来购买多种升级，你可以在蒸笼标签页里面找到这些升级。`;
    },
    scGainInfo() {
      return `你将获得${quantify("蒸笼次数", this.gainedSteamerCoins, 2, 0)}
and ${quantify("蒸笼币", this.gainedSteamerCoins, 2, 0)}.`;
    },
    startingResources() {
      const gainedResources = [];
      if (this.startingJiaozi.gte(10)) gainedResources.push(`${quantify("饺子", this.startingJiaozi, 2, 1)}`);
      if (this.startingWrapper > 0) gainedResources.push(`${quantify("饺子皮", this.startingWrapper)}`);
      if (this.startingStuffing) gainedResources.push(`${quantify("饺子馅", this.startingStuffing)}`);

      return `你将以${makeEnumeration(gainedResources)}进入下一个蒸笼。`;
    }
  },
  methods: {
    update() {
      this.gainedSteamerCount = new Decimal(1) //ga().round();
      this.gainedSteamerCoins = gainedSteamerCoins().round();
      this.startingWrapper = 0 //DimBoost.startingDimensionBoosts;
      this.startingJiaozi = new Decimal(10) //Currency.antimatter.startingValue;
      this.startingStuffing = 0 //InfinityUpgrade.skipResetGalaxy.isBought;
    },
    handleYesClick() {
      steamerRequest();
      EventHub.ui.offAll(this);
      if (this.isFirstSteamer) {
        setTimeout(() => Modal.message.show(`此动画将在每次手动修复蒸笼之后出现。如果
如果要禁用它，在“选项”标签页中有一个设置。可以用于控制游戏的动画效果。`, {}, 3), 2000);
      }
    }
  },
  template: `<ResetModal
header="你将要修复蒸笼"
:message="message"
:gained-resources="scGainInfo"
:starting-resources="startingResources"
:confirm-fn="handleYesClick"
:alternate-condition="isFirstSteamer"
:alternate-text="message"
:confirm-option="isFirstSteamer ? undefined : 'steamer'"
/>`
}