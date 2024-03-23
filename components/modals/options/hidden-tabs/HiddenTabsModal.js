import HiddenTabGroup from "./HiddenTabGroup.js";
import ModalWrapperOptions from "../ModalWrapperOptions.js";

export default {
  name: "HiddenTabsModal",
  components: {
    HiddenTabGroup,
    ModalWrapperOptions,
  },
  computed: {
    tabs: () => Tabs.currentUIFormat,
  },
  template: `
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      修改可见标签页
    </template>
    <div class="c-modal--short">
      点击按钮以切换显示状态
      <br>
      你无法隐藏某些标签页
      <br>
      隐藏标签页的同时也会隐藏其子标签页
      <br>
      <HiddenTabGroup
        v-for="(tab, index) in tabs"
        :key="index"
        :tab="tab"
        :change-enabled="true"
        class="l-hide-modal-tab-container"
      />
    </div>
  </ModalWrapperOptions>
  `
}