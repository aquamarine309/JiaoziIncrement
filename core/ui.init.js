export const state = {
  view: {
    modal: {
      queue: [],
      current: undefined,
      cloudConflict: [],
      progressBar: undefined,
    },
    quotes: {
      queue: [],
      current: undefined,
      history: undefined
    },
    shiftDown: false,
    theme: "Normal",
    steamer: false,
    scrollWindow: 0,
    currentContextMenu: null,
    tab: "main",
    subtab: "maker",
    initialized: false,
    tutorialState: 0,
    tutorialActive: true,
    h2pForcedTab: undefined,
    language: "",
  },
  notationName: "",
  formatPreBreak: false,
  lastClickTime: 0
};
