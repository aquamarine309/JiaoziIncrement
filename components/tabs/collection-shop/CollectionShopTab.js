export default {
  name: "CollectionShopTab",
  data() {
    return {
      upgradesUnlocked: false
    }
  },
  methods: {
    update() {
      this.upgradesUnlocked = SimulationMilestone.upgrades.isReached;
    }
  },
  template: `
    <div class="c-col-shop-tab">
      <p class="c-shop-info">欢迎来到收集商店！</p>
      <p class="c-shop-info">这里有众多来自<span class="c-ending-info">#%筝.9@/=</span>的物品！</p>
      <br>
      <p><i>欸？！这里还没准备好吗？</i></p>
      <p v-if="upgradesUnlocked"><i>终止...模拟？也许我需要收集那个东西吧。</i></p>
      <p v-else><i>终...？这是什么？看不懂...</i></p>
    </div>
  `
}