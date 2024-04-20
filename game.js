import TWEEN from './modules/Tween.js'
import { DC } from "./core/constants.js";
import { deepmergeAll } from "./deepmerge.js";
import { supportedBrowsers } from "./supported-browsers.js";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

let times = 0
export function gameLoop(passDiff, options = {}) {
  PerformanceStats.start("Frame Time");
  PerformanceStats.start("Game Update");
  
  EventHub.dispatch(GAME_EVENT.GAME_TICK_BEFORE);
  
  let diff = passDiff
  const thisUpdate = Date.now()
  
  const realDiff = diff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7)
    : diff;
    
  diff = realDiff
  // For single ticks longer than a minute from the GameInterval loop, we assume that the device has gone to sleep or
  // hibernation - in those cases we stop the interval and simulate time instead. The gameLoop interval automatically
  // restarts itself at the end of the simulateTime call. This will not trigger for an unfocused game, as this seems to
  // result in a ~1 second tick rate for browsers.
  // Note that we have to explicitly call all the real-time mechanics with the existing value of realDiff, because
  // simply letting it run through simulateTime seems to result in it using zero
  if (player.options.hibernationCatchup && passDiff === undefined && realDiff > 6e4) {
    GameIntervals.gameLoop.stop();
    simulateTime(realDiff / 1000, true);
    return;
  }
  
    
  GameCache.makerCommonMultiplier.invalidate();
  GameCache.makerFinalMultipliers.invalidate();
  GameCache.factoryCommonMultiplier.invalidate();
  GameCache.totalSCMult.invalidate();
  GameCache.totalCoresMult.invalidate();
  GameCache.totalEnergyMult.invalidate();
  
  player.records.realTimePlayed += realDiff;
  player.records.totalTimePlayed += diff;
  player.records.thisSale.realTime += realDiff;
  player.records.thisSale.time += diff;
  player.records.thisBigReset.realTime += realDiff;
  player.records.thisBigReset.time += diff;
  player.records.thisSteamer.realTime += realDiff;
  player.records.thisSteamer.time += diff;
  player.records.thisSimulation.realTime += realDiff;
  player.records.thisSimulation.time += diff;
   
  DeltaTimeState.update(realDiff, diff);
  
  preProductionGenerateSC(diff);
  Autobuyers.tick();
  Tutorial.tutorialLoop();
  
  SimulationAnimation.tick(realDiff);
  Factories.tick(diff);
  Makers.tick(diff);
  
  if (SimulationMilestone.upgrades.isReached) {
    Currency.energy.add(energyPerSecond().times(diff / 1000));
  }
  
  Factories.tryAutoUnlock();
  
  updatePrestigeRates();
  applyAutoprestige(diff);
  
  EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  GameUI.update();
  player.lastUpdate = thisUpdate;
  PerformanceStats.end("Game Update");
}

window.onload = function() {
  const supportedBrowser = browserCheck();
  GameUI.initialized = supportedBrowser;
  ui.view.initialized = supportedBrowser;
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 500);
  if (!supportedBrowser) {
    GameIntervals.stop();
    document.getElementById("loading").style.display = "none";
    document.getElementById("browser-warning").style.display = "flex";
  }
};

export function browserCheck() {
  return supportedBrowsers.test(navigator.userAgent);
}

export function init() {
  GameStorage.load()
  Tabs.all.find(t => t.config.id === player.options.lastOpenTab).show(true);
  console.log('游戏加载成功（⌒▽⌒）');
}

window.tweenTime = 0;
let lastFrame;
function animateTweens(time) {
  requestAnimationFrame(animateTweens);
  if (time === undefined || lastFrame === undefined) {
    lastFrame = time;
    return;
  }
  let delta = time - lastFrame;
  lastFrame = time;
  tweenTime += delta;
  TWEEN.update(tweenTime);
}

animateTweens();


export function simulateTime(seconds, real, fast) {
  // The game is simulated at a base 50ms update rate, with a maximum tick count based on the values of real and fast
  // - Calling with real === true will always simulate at full accuracy with no tick count reduction unless it would
  //   otherwise simulate with more ticks than offline progress would allow
  // - Calling with fast === true will only simulate it with a max of 50 ticks
  // - Otherwise, tick count will be limited to the offline tick count (which may be set externally during save import)
  // Tick count is never *increased*, and only ever decreased if needed.
  if (seconds < 0) return;
  let ticks = Math.floor(seconds * 20);

  // Limit the tick count (this also applies if the black hole is unlocked)
  const maxTicks = GameStorage.maxOfflineTicks(1000 * seconds, GameStorage.offlineTicks ?? player.options.offlineTicks);
  if (ticks > maxTicks && !fast) {
    ticks = maxTicks;
  } else if (ticks > 50 && !real && fast) {
    ticks = 50;
  }

  const playerStart = deepmergeAll([{}, player]);

  EventHub.dispatch(GAME_EVENT.OFFLINE_CURRENCY_GAINED);

  let remainingRealSeconds = seconds;
  // During async code the number of ticks remaining can go down suddenly
  // from "Speed up" which means tick length needs to go up, and thus
  // you can't just divide total time by total ticks to get tick length.
  // For example, suppose you had 6000 offline ticks, and called "Speed up"
  // 1000 ticks in, meaning that after "Speed up" there'd only be 1000 ticks more
  // (so 1000 + 1000 = 2000 ticks total). Dividing total time by total ticks would
  // use 1/6th of the total time before "Speed up" (1000 of 6000 ticks), and 1/2 after
  // (1000 of 2000 ticks). Short of some sort of magic user prediction to figure out
  // whether the user *will* press "Speed up" at some point, dividing remaining time
  // by remaining ticks seems like the best thing to do.
  let loopFn = i => {
    const diff = remainingRealSeconds / i;
    gameLoop(1000 * diff);
    remainingRealSeconds -= diff;
  };

  // We don't show the offline modal here or bother with async if doing a fast simulation
  if (fast) {
    // Fast simulations happen when simulating between 10 and 50 seconds of offline time.
    // One easy way to get this is to autosave every 30 or 60 seconds, wait until the save timer
    // in the bottom-left hits 15 seconds, and refresh (without saving directly beforehand).
    GameIntervals.stop();
    // Fast simulations are always 50 ticks. They're done in this weird countdown way because
    // we want to be able to call the same function that we call when using async code (to avoid
    // duplicating functions), and that function expects a parameter saying how many ticks are remaining.
    for (let remaining = 50; remaining > 0; remaining--) {
      loopFn(remaining);
    }
    GameStorage.postLoadStuff();
    afterSimulation(seconds, playerStart);
  } else {
    const progress = {};
    ui.view.modal.progressBar = {};
    Async.run(loopFn,
      ticks,
      {
        batchSize: 1,
        maxTime: 60,
        sleepTime: 1,
        asyncEntry: doneSoFar => {
          GameIntervals.stop();
          ui.$viewModel.modal.progressBar = {
            label: "offlineSimulation",
            info: () => $t("offlineProgressInfo", [formatInt(500), formatInt(10)]),
            progressName: "tick",
            current: doneSoFar,
            max: ticks,
            startTime: Date.now(),
            buttons: [{
              text: "speedUp",
              condition: (current, max) => max - current > 500,
              click: () => {
                const newRemaining = Math.clampMin(Math.floor(progress.remaining / 2), 500);
                // We subtract the number of ticks we skipped, which is progress.remaining - newRemaining.
                // This, and the below similar code in "SKIP", are needed or the progress bar to be accurate
                // (both with respect to the number of ticks it shows and with respect to how full it is).
                progress.maxIter -= progress.remaining - newRemaining;
                progress.remaining = newRemaining;
                // We update the progress bar max data (remaining will update automatically).
                ui.$viewModel.modal.progressBar.max = progress.maxIter;
              }
            },
            {
              text: "skip",
              condition: (current, max) => max - current > 10,
              click: () => {
                // We jump to 10 from the end (condition guarantees there are at least 10 left).
                // We subtract the number of ticks we skipped, which is progress.remaining - 10.
                progress.maxIter -= progress.remaining - 10;
                progress.remaining = 10;
              }
            }]
          };
        },
        asyncProgress: doneSoFar => {
          ui.$viewModel.modal.progressBar.current = doneSoFar;
        },
        asyncExit: () => {
          ui.$viewModel.modal.progressBar = undefined;
          // .postLoadStuff will restart GameIntervals
          GameStorage.postLoadStuff();
        },
        then: () => {
          afterSimulation(seconds, playerStart);
        },
        progress
      });
  }
}

function afterSimulation(seconds, playerBefore) {
  if (seconds > 600) {
    const playerAfter = deepmergeAll([{}, player]);
    Modal.awayProgress.show({ playerBefore, playerAfter, seconds });
  }
}

export function setShiftKey(isDown) {
  ui.view.shiftDown = isDown;
}

export function breakInfinity() {
  if (!Player.allSteamerUpgradesBought) return;
  for (const autobuyer of Autobuyers.all) {
    if (autobuyer.data.interval !== undefined) autobuyer.maxIntervalForFree();
  }
  player.break = !player.break;
  EventHub.dispatch(player.break ? GAME_EVENT.BREAK_INFINITY : GAME_EVENT.FIX_INFINITY);
  GameUI.update();
}

function updatePrestigeRates() {
  const colMin = gainedCols() / Math.clampMin(0.005, Time.thisBigResetRealTime.totalMinutes)
  if (colMin > player.records.thisBigReset.bestColMin && Stuffing.bigResetCheck) {
    player.records.thisBigReset.bestColMin = colMin
    player.records.thisBigReset.bestColMinValue = gainedCols()
  }
  const scMin = gainedSteamerCoins().div(Math.clampMin(0.005, Time.thisSteamerRealTime.totalMinutes))
  if (scMin.gt(player.records.thisSteamer.bestSCmin) && Player.canFixSteamer) {
    player.records.thisSteamer.bestSCmin = scMin
    player.records.thisSteamer.bestSCminValue = gainedSteamerCoins()
  }
}

function applyAutoprestige(diff) {
  Currency.money.add(NormalChallenge(2).reward.effectOrDefault(0));
}

export function resetChallengeStuff() {
  player.postC7Tier = 1;
}

window.onblur = function() {
  GameKeyboard.stopSpins();
};

export function addSimulationTime(time, realTime, currency, count) {
  player.records.recentSimulation.pop();
  player.records.recentSimulation.unshift({
    time,
    realTime,
    currency,
    count
  });
}

export function resetSimulationRuns() {
  player.records.recentSimulation = Array.from(
    { length: 10 },
    () => ({
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      currency: name === PRESTIGE_NAME.BIG_RESET ? 0 : DC.D0,
      count: DC.D0
    })
  );
}