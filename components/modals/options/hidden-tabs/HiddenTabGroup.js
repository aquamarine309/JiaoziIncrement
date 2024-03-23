import HiddenSubtabsButton from "./HiddenSubtabsButton.js";

export default {
  name: "HiddenTabGroup",
  components: {
    HiddenSubtabsButton,
  },
  props: {
    tab: {
      type: Object,
      required: true
    },
    changeEnabled: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isVisible: false,
      isHidable: false,
      isHidden: false,
      unlockedSubtabs: [],
    };
  },
  computed: {
    tabName() {
      return this.tab.name;
    },
    subtabs() {
      return this.tab.subtabs;
    },
    isCurrentTab() {
      return this.tab.id === Tabs.current.id;
    },
    alwaysVisible() {
      return !this.isHidable || this.isCurrentTab;
    },
    rowClass() {
      return {
        "c-hide-modal-all-subtab-container": true,
        "l-hide-modal-subtab-container": true,
        "c-hidden-tabs-background__visible": !this.isHidden,
        "c-hidden-tabs-background__hidden": this.isHidden,
        "c-hidden-tabs-background__always-visible": this.alwaysVisible
      };
    },
    rowVisibleIndicatorClass() {
      return {
        "c-indicator-icon": true,
        "fas": true,
        "fa-check": !this.isHidden,
        "fa-times": this.isHidden,
        "fa-exclamation": this.alwaysVisible,
      };
    },
  },
  methods: {
    update() {
      const tab = this.tab;
      this.isVisible = tab.isUnlocked;
      this.isHidable = tab.hidable;
      this.isHidden = tab.isHidden && this.isHidable;
      this.unlockedSubtabs = this.subtabs.filter(sub => sub.isUnlocked);
    },
    toggleVisibility() {
      if (!this.changeEnabled) return;
      // If this tab and all unlocked subtabs are hidden, unhide all subtabs in addition to the tab
      if (this.tab.isHidden && this.unlockedSubtabs.every(t => t.isHidden)) {
        for (const subtab of this.unlockedSubtabs) {
          subtab.toggleVisibility();
        }
        this.tab.unhideTab();
      } else {
        this.tab.toggleVisibility();
      }
    }
  },
  template: `
  <div
    v-if="isVisible"
    :class="rowClass"
    @click.self="toggleVisibility"
  >
    <HiddenSubtabsButton
      v-for="(subtab, i) in unlockedSubtabs"
      :key="i"
      :subtab="subtab"
      :tab="tab"
      :change-enabled="changeEnabled"
    />
    <div
      :class="rowVisibleIndicatorClass"
      @click="toggleVisibility"
    />
  </div>
  `
}