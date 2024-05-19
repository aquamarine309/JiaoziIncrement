import ModalWrapperChoice from "./ModalWrapperChoice.js";

export default {
  name: "LoseMilestoneModal",
  props: {
    purchase: {
      type: Function,
      required: true
    }
  },
  components: {
    ModalWrapperChoice
  },
  methods: {
    buy() {
      this.purchase();
      this.emitClose();
    }
  },
  template: `
    <ModalWrapperChoice :confirmFn="buy">
      <template #header>
        你将购买模拟升级
      </template>
      购买模拟升级后，你将会失去一些模拟里程碑，并会终止本次模拟。
    </ModalWrapperChoice>
  `
}