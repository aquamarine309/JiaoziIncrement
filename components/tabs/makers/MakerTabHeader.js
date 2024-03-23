import JiaoziSaleButton from './JiaoziSaleButton.js'
import PrimaryButton from '../../PrimaryButton.js'

export default {
  name: 'MakerTabHeader',
  components: {
    JiaoziSaleButton,
    PrimaryButton
  },
  methods: {
    maxAll() {
      maxAll()
    }
  },
  template: `
    <div class='o-maker-tab-header'>
      <JiaoziSaleButton />
      <PrimaryButton
      @click='maxAll'
      class='o-maker-max-all'
      >
        {{ $t("maxAll") }}(M)
      </PrimaryButton>
    </div>
  `
}