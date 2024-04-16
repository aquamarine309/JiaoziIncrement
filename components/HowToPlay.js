export
default {
  name: "HowToPlay",
  data() {
    return {
      hasTutorial: false
    };
  },
  computed: {
    h2pClassObject() {
      return {
        "o-tab-btn l-help-me": true,
      };
    },
    topMargin() {
      return {
        "margin-top": "1rem",
      };
    }
  },
  methods: {
    update() {
      this.hasTutorial = Tutorial.emphasizeH2P();
    },
    showH2P() {
      Modal.h2p.show();
    }
  },
  template: `
    <div>
      <div
        :class="h2pClassObject"
        :style="topMargin"
        @click="showH2P"
      >
        ?
      </div>
    </div>
  `
}