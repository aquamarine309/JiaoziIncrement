import { GameMechanicState } from "./game-mechanics/game-mechanic.js"

class TaskRewardState extends GameMechanicState {
  constructor(config, task) {
    config.effect = () => this.config.effectFn(this.count)
    super(config)
    this._task = task
  }

  get count() {
    return this.task.count
  }

  get task() {
    return this._task
  }

  get isEffectActive() {
    return this.count > 0
  }
}

class TaskState extends GameMechanicState {
  constructor(config) {
    config.description = () => {
      if (this.count >= this.cap) return "已完成";
      return config.descriptionTemp(this.goal);
    }
    super(config);
    this.reward = new TaskRewardState(config.reward, this);
  }

  get key() {
    return this.config.key;
  }

  get count() {
    return player.tasks[this.key];
  }

  set count(value) {
    player.tasks[this.key] = value;
  }

  get goal() {
    return this.config.goal(this.count);
  }

  get cap() {
    return this.config.cap || Infinity;
  }

  get percents() {
    if (this.count >= this.cap) return 0;
    const lastGoal = this.count === 0 ? undefined : this.config.goal(this.count - 1);
    return Math.max(Decimal.min(this.config.percents(this.goal, lastGoal), 1).toNumber(), 0);
  }

  get condition() {
    if (this.config.condition) return this.config.condition();
    return true;
  }

  get howMany() {
    //Need to add 1.
    return Math.min(Math.floor(this.config.howMany() + 1), this.cap);
  }

  get canComplete() {
    if (!this.condition) return false;
    return this.howMany > this.count;
  }

  complete() {
    if (!this.canComplete) return;
    EventHub.logic.dispatch(GAME_EVENT.COMPLETE_TASK);
    this.count = this.howMany
  }

  reset() {
    this.count = 0;
  }
}

export const Task = mapGameDataToObject(
  GameDatabase.steamer.tasks,
  config => new TaskState(config)
)

export function resetTasks() {
  Task.all.forEach(t => t.reset())
}