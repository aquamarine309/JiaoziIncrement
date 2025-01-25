window.TimeSpan = class TimeSpan {
  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromYears(value) {
    return new TimeSpan(value * 31536e6);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromDays(value) {
    return new TimeSpan(value * 864e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromHours(value) {
    return new TimeSpan(value * 36e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMinutes(value) {
    return new TimeSpan(value * 6e4);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromSeconds(value) {
    return new TimeSpan(value * 1e3);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMilliseconds(value) {
    return new TimeSpan(value);
  }

  /**
   * @param {Number} ms
   */
  constructor(ms) {
    Guard.isNumber(ms, "Value 'ms' must be a number");
    this._ms = ms;
  }

  /**
   * @param {TimeSpan} other
   */
  copyFrom(other) {
    Guard.isTimeSpan(other);
    this._ms = other._ms;
  }

  /**
   * @param {Number} ms
   */
  setFrom(ms) {
    Guard.isNumber(ms);
    this._ms = ms;
  }

  /**
   * @returns {Number}
   */
  get years() {
    return Math.floor(this.totalYears);
  }

  /**
   * @returns {Number}
   */
  get days() {
    return Math.floor(this.totalDays % 365);
  }

  /**
   * @returns {Number}
   */
  get hours() {
    return Math.floor(this.totalHours % 24);
  }

  /**
   * @returns {Number}
   */
  get minutes() {
    return Math.floor(this.totalMinutes % 60);
  }

  /**
   * @returns {Number}
   */
  get seconds() {
    return Math.floor(this.totalSeconds % 60);
  }

  /**
   * @returns {Number}
   */
  get milliseconds() {
    return Math.floor(this.totalMilliseconds % 1e3);
  }

  /**
   * @returns {Number}
   */
  get totalYears() {
    return this._ms / 31536e6;
  }

  /**
   * @returns {Number}
   */
  get totalDays() {
    return this._ms / 864e5;
  }

  /**
   * @returns {Number}
   */
  get totalHours() {
    return this._ms / 36e5;
  }

  /**
   * @returns {Number}
   */
  get totalMinutes() {
    return this._ms / 6e4;
  }

  /**
   * @returns {Number}
   */
  get totalSeconds() {
    return this._ms / 1e3;
  }

  /**
   * @returns {Number}
   */
  get totalMilliseconds() {
    return this._ms;
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  plus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms + other._ms);
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  minus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms - other._ms);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  times(other) {
    Guard.isNumber(other);
    return new TimeSpan(this._ms * other);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  dividedBy(other) {
    Guard.isNumber(other);
    return new TimeSpan(this._ms / other);
  }

  /**
   * @returns {String}
   */
  toString() {
    if (this.years > 1e6) {
      return `${format(this.totalYears, 3, 0)}年`;
    }
    if (this.totalSeconds >= 10) {
      return this.toStringNoDecimals();
    }
    return this.toStringShort();
  }

  toStringDecimals() {
    const totalSeconds = this.totalSeconds;
    if (totalSeconds < 1) {
      return this.toStringShort();
    }
    const totalMinutes = this.totalMinutes;
    if (totalMinutes < 60) {
      return `${formatHMS(this.minutes)}:${formatHMS(this.seconds)}`
    }
    const totalHours = this.totalHours;
    if (totalHours < 24) {
      return `${formatHMS(this.hours)}${formatHMS(this.minutes)}:${formatHMS(this.seconds)}`
    }

    return `${this.totalDays.toFixed(2)}${$t("day_short")}`

    function formatHMS(value) {
      const s = value.toString();
      return s.length === 1 ? `0${s}` : s;
    }

    function seconds(s, ms) {
      const sec = formatHMS(s);
      return isSpeedrun ? `${sec}.${Math.floor(ms / 100)}` : sec;
    }
  }

  /**
   * @returns {String}
   */
  toStringNoDecimals() {
    const parts = [];
    function addCheckedComponent(value, name) {
      if (value === 0) {
        return;
      }
      addComponent(value, name);
    }
    function addComponent(value, name) {
      let displayName = name;
      if (Languages.current.name === "en" && value !== 1) displayName = `${name}s`;
      parts.push(`${formatInt(value)} ${displayName}`);
    }
    addCheckedComponent(this.years, $t("year"));
    addCheckedComponent(this.days, $t("day"));
    addCheckedComponent(this.hours, $t("hour"));
    addCheckedComponent(this.minutes, $t("minute"));
    addCheckedComponent(this.seconds, $t("second"));
    if (parts.length === 0) return `${formatInt(0)} ${$t("second", null, true)}`;
    if (Languages.current.name === "en") {
      return [parts.slice(0, -1).join(", "), parts.last()].join(parts.length < 2 ? "" : " and ");
    }
    return parts.join(" ");
  }

  /**
   * Note: For speedruns, we give 3 digits of hours on HMS formatting, a decimal point on seconds, and
   *  suppress END formatting on the speedrun record tabs
   * @param {boolean} useHMS If true, will display times as HH:MM:SS in between a minute and 100 hours.
   * @returns {String}
   */
  toStringShort(useHMS = true, isSpeedrun = false) {

    const totalSeconds = this.totalSeconds;
    if (totalSeconds > 5e-7 && totalSeconds < 1e-3) {
      // This conditional happens when when the time is less than 1 millisecond
      // but big enough not to round to 0 with 3 decimal places (so showing decimal places
      // won't just show 0 and waste space).
      return `${format(1000 * totalSeconds, 0, 3)} ${$t("ms")}`;
    }
    if (totalSeconds < 1) {
      // This catches all the cases when totalSeconds is less than 1 but not
      // between 5e-7 and 1e-3. This includes two types of cases:
      // (1) those less than or equal to 5e-7, which most notations will format as 0
      // (the most notable case of this kind is 0 itself).
      // (2) those greater than or equal to 1e-3, which will be formatted with default settings
      // (for most notations, rounding to the nearest integer number of milliseconds)
      return `${format(1000 * totalSeconds)} ${$t("ms")}`;
    }
    if (totalSeconds < 10) {
      return `${format(totalSeconds, 0, 3)} ${$t("second", null, true)}`;
    }
    if (totalSeconds < 60) {
      return `${format(totalSeconds, 0, 2)} ${$t("second", null, true)}`;
    }
    if (this.totalHours < 100 || (isSpeedrun && this.totalHours < 1000)) {
      if (useHMS && !Notations.current.isPainful) {
        const sec = seconds(this.seconds, this.milliseconds);
        if (Math.floor(this.totalHours) === 0) return `${formatHMS(this.minutes)}:${sec}`;
        return `${formatHMS(Math.floor(this.totalHours))}:${formatHMS(this.minutes)}:${sec}`;
      }
      if (this.totalMinutes < 60) {
        return `${format(this.totalMinutes, 0, 2)} ${$t("minute", null, true)}`;
      }
      if (this.totalHours < 24) {
        return `${format(this.totalHours, 0, 2)} ${$t("hour", null, true)}`;
      }
    }
    if (this.totalDays < 500) {
      return `${isSpeedrun ? this.totalDays.toFixed(2) : format(this.totalDays, 0, 2)} ${$t("day", null, true)}`;
    }
    return `${isSpeedrun ? this.totalYears.toFixed(3) : format(this.totalYears, 3, 2)} ${$t("year", null, true)}`;

    function formatHMS(value) {
      const s = value.toString();
      return s.length === 1 ? `0${s}` : s;
    }

    function seconds(s, ms) {
      const sec = formatHMS(s);
      return isSpeedrun ? `${sec}.${Math.floor(ms / 100)}` : sec;
    }
  }

  toTimeEstimate() {
    const seconds = this.totalSeconds;
    if (seconds < 1) return `< ${formatInt(1)} ${$t("second")}`;
    if (seconds > 86400 * 365.25) return `> ${formatInt(1)} ${$t("year")}`;
    return this.toStringShort();
  }

  static get zero() {
    return new TimeSpan(0);
  }

  static get maxValue() {
    return new TimeSpan(Number.MAX_VALUE);
  }

  static get minValue() {
    return new TimeSpan(Number.MIN_VALUE);
  }
};

const Guard = {
  isDefined(value, message) {
    if (value !== undefined) return;
    if (message) throw message;
    throw "Value is defined";
  },
  isNumber(value, message) {
    if (typeof value === "number") return;
    if (message) throw message;
    throw "Value is not a number";
  },
  isTimeSpan(value, message) {
    if (value instanceof TimeSpan) return;
    if (message) throw message;
    throw "Value is not a TimeSpan";
  }
};
