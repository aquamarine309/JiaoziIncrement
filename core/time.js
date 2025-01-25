export const DeltaTimeState = {
  deltaTime: new TimeSpan(0),
  unscaledDeltaTime: new TimeSpan(0),
  update(deltaTime, gameDeltaTime) {
    this.unscaledDeltaTime = TimeSpan.fromMilliseconds(deltaTime);
    this.deltaTime = TimeSpan.fromMilliseconds(gameDeltaTime);
  }
};

export const Time = {
  /**
   * @param {Function} getValue
   * @returns {TimeSpan}
   */
  fromMilliseconds(getValue) {
    return TimeSpan.fromMilliseconds(getValue());
  },
  /**
   * @param {TimeSpan} timespan
   * @param {Function} setValue
   */
  toMilliseconds(timespan, setValue) {
    Guard.isTimeSpan(timespan);
    setValue(timespan.totalMilliseconds);
  },
  /**
   * Returns a string indicating the current date and time of day, as indicated by a Date.now() timestamp. After
   * regex formatting, this gives a string resembling "[month] [day] [year] HH:MM:SS"
   * @param {number} timestamp
   * @returns {string}
   */
  toDateTimeString(timestamp) {
    return new Date(timestamp).toLocaleString();
  },

  /**
   * Frame delta time
   * @returns {TimeSpan}
   */
  get deltaTimeFull() {
    return DeltaTimeState.deltaTime;
  },
  /**
   * Frame delta time in seconds
   * @returns {number}
   */
  get deltaTime() {
    return this.deltaTimeFull.totalSeconds;
  },
  /**
   * Frame delta time in ms
   * @returns {number}
   */
  get deltaTimeMs() {
    return this.deltaTimeFull.totalMilliseconds;
  },
  /**
   * Frame delta time, but without EC12 or black hole effects
   * @returns {TimeSpan}
   */
  get unscaledDeltaTime() {
    return DeltaTimeState.unscaledDeltaTime;
  },

  /**
   * @returns {TimeSpan}
   */
  get totalTimePlayed() {
    return this.fromMilliseconds(() => player.records.totalTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set totalTimePlayed(timespan) {
    this.toMilliseconds(timespan, value => player.records.totalTimePlayed = value);
  },
  /**
   * @returns {TimeSpan}
   */
  get realTimePlayed() {
    return this.fromMilliseconds(() => player.records.realTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set realTimePlayed(timespan) {
    this.toMilliseconds(timespan, value => player.records.realTimePlayed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisBigReset() {
    return this.fromMilliseconds(() => player.records.thisBigReset.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisBigReset(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisBigReset.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisSale() {
    return this.fromMilliseconds(() => player.records.thisSale.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisSale(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisSale.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisSaleRealTime() {
    return this.fromMilliseconds(() => player.records.thisSale.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisSaleRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisSale.realTime = value);
  },
  /**
   * @returns {TimeSpan}
   */
  get thisBigResetRealTime() {
    return this.fromMilliseconds(() => player.records.thisBigReset.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisBigResetRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisBigReset.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestBigReset() {
    return this.fromMilliseconds(() => player.records.bestBigReset.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestBigReset(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestBigReset.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestBigResetRealTime() {
    return this.fromMilliseconds(() => player.records.bestBigReset.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestBigResetRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestBigReset.realTime = value);
  },
  /**
   * @returns {TimeSpan}
   */
  get thisSteamer() {
    return this.fromMilliseconds(() => player.records.thisSteamer.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisSteamer(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisSteamer.time = value);
  },
  /**
   * @returns {TimeSpan}
   */
  get thisSteamerRealTime() {
    return this.fromMilliseconds(() => player.records.thisSteamer.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisSteamerRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisSteamer.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestSteamer() {
    return this.fromMilliseconds(() => player.records.bestSteamer.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestSteamer(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestSteamer.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestSteamerRealTime() {
    return this.fromMilliseconds(() => player.records.bestSteamer.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestSteamerRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestSteamer.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisSimulation() {
    return this.fromMilliseconds(() => player.records.thisSimulation.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisSimulation(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisSimulation.time = value);
  },
  /**
   * @returns {TimeSpan}
   */
  get thisSimulationRealTime() {
    return this.fromMilliseconds(() => player.records.thisSimulation.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisSimulationRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisSimulation.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestSimulation() {
    return this.fromMilliseconds(() => player.records.bestSimulation.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestSimulation(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestSimulation.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestSimulationRealTime() {
    return this.fromMilliseconds(() => player.records.bestSimulation.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestSimulationRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestSimulation.realTime = value);
  },
  /**
   * @return {TimeSpan}
   */
  get worstChallenge() {
    return this.fromMilliseconds(() => GameCache.worstChallengeTime.value);
  },

    /**
   * @return {TimeSpan}
   */
  get normalChallengeSum() {
    return this.fromMilliseconds(() => GameCache.normalChallengeTimeSum.value);
  },
};
