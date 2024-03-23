export
default {
  name: "OpenModalHotkeysButton",
  methods: {
    handleClick() {
      Modal.hotkeys.show();
    }
  },
  template: `
  <p
    class="c-options-tab__hotkeys-link"
    @click="handleClick"
  >
    {{ $t("press") }} <kbd>?</kbd> {{ $t("openHotkey") }}
  </p>
  `
}