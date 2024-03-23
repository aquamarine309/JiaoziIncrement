import TabButton from './TabButton.js'
import SidebarCurrency from './SidebarCurrency.js'

export default {
  name: "Sidebar",
  components: {
    SidebarCurrency,
    TabButton
  },
  data() {
    return {
      isHidden: false,
      tabVisibilities: []
    };
  },
  computed: {
    tabs: () => Tabs.currentUIFormat
  },
  methods: {
    update() {
      this.isHidden = false;
      this.tabVisibilities = Tabs.currentUIFormat.map(x => x.isAvailable);
    },
  },
  template: `
    <div
    v-if="!isHidden"
    class="c-modern-sidebar"
    >
    <SidebarCurrency />
    <template
      v-for="(tab, tabPosition) in tabs"
    >
      <TabButton
        v-if="tabVisibilities[tabPosition]"
        :key="tab.name"
        :tab="tab"
        :tab-position="tabPosition"
      />
    </template>
  </div>
  `
};
