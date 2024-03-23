import PrimaryButton from '../../PrimaryButton.js'

export default {
  name: 'BaoJiaoZaButton',
  components: {
    PrimaryButton
  },
  data() {
    return {
      howMany: new Decimal(0)
    }
  },
  methods: {
    make() {
      makeJiaozi()
    },
    update() {
      this.howMany = Maker(1).productionPerSecond.times(0.5).timesEffectOf(Collections.antimatter)
    }
  },
  template: `
    <PrimaryButton
    class='o-baojiaoza-btn'
    @click='make'
    >
      {{ $t("bao") }}(+{{ format(howMany, 2) }})
    </PrimaryButton>
  `
}