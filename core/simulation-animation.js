export const SimulationAnimation = {
  get state() {
    return player.simulationAnimationState;
  },
  
  set state(value) {
    player.simulationAnimationState = value;
  },
  
  get isActive() {
    return player.isSimulationAnimationActive;
  },
  
  set isActive(value) {
    player.isSimulationAnimationActive = value;
  },
  
  get isReverse() {
    return player.isSimulationAnimationReverse;
  },
  
  set isReverse(value) {
    player.isSimulationAnimationReverse = value;
  },
  
  tick(diff) {
    if (!this.isActive) return false;
    if (this.isReverse) {
      this.state = this.state / Math.pow(1.75, diff / 1000) - 0.01;
      if (this.state < 0) {
        this.reset();
        return;
      }
    } else if (this.state <= 100) {
      this.state = (this.state + 0.01) * Math.pow(1.3, diff / 1000);
    }
  },
  
  reset() {
    if (!this.isActive) return;
    this.isActive = false;
    this.state = 0;
    this.isReverse = false;
  },
  
  start() {
    if (this.isActive) return;
    if (!Player.canConclude) return;
    Modal.hideAll();
    this.isActive = true;
  },
  
  reverse() {
    this.isReverse = true;
  },
  
  get errors() {
    const currency = ["饺子", "饺子币", "饺子皮", "饺子馅"]
    const base = ["售出", "收集重置", "蒸笼重置"];
    const makers = Makers.all.filter(m => m.tier <= Makers.maxTier).map(m => m.name);
    const colls = Collections.all.filter(c => c.isUnlocked).map(c => c.name);
    const ach = Achievements.all.filter(a => a.isUnlocked).map(a => `成就${a.id}`);
    const steamerUpgrades = SteamerUpgrade.all.filter(u => u.isBought).map((u, i) => `蒸笼升级[${i + 1}]`);
    const factories = Factories.all.filter(f => f.isUnlocked).map(f => f.name);
    const tasks = Task.all.filter(t => t.count > 0).map(t => `任务${t.id}`);
    return currency.concat(makers, colls, ach, steamerUpgrades, factories, tasks, base);
  }
}