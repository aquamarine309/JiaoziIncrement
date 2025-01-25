export class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isCollectionUnlocked() {
    return this._player.bigResetCount.gt(0) || this.isSteamerUnlocked;
  }

  get isSteamerUnlocked() {
    return this._player.steamerCount.gt(0) || this.isSimulationUnlocked;
  }

  get isFactoriesUnlocked() {
    return this._player.challenge.normal.completedBits >= 510 || this.isSimulationUnlocked;
  }

  get isTasksUnlocked() {
    //4级工厂时解锁
    return this._player.factories[3].isUnlocked || this.isSimulationUnlocked;
  }

  get isSimulationUnlocked() {
    return this._player.simulations.gt(0);
  }

  static get current() {
    return new PlayerProgress(player);
  }

  static of(player) {
    return new PlayerProgress(player);
  }

  static collectionUnlocked() {
    return PlayerProgress.current.isCollectionUnlocked;
  }

  static steamerUnlocked() {
    return PlayerProgress.current.isSteamerUnlocked;
  }

  static factoriesUnlocked() {
    return PlayerProgress.current.isFactoriesUnlocked;
  }

  static tasksUnlocked() {
    return PlayerProgress.current.isTasksUnlocked;
  }

  static simulationUnlocked() {
    return PlayerProgress.current.isSimulationUnlocked;
  }

  static hasBroken() {
    return player.break || this.simulationUnlocked();
  }
}
