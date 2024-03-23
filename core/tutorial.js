export const TUTORIAL_STATE = {
  MAKER1: 0,
  WRAPPER: 1,
  STUFFING: 2,
  COLLECTION: 3
};

// Tutorial has two ways of moving on, either by Tutorial.moveOn() or by having it's condition be true. This
// is checked by moving on when the NEXT state's condition evaluates to true
const tutorialStates = [
  {
    id: TUTORIAL_STATE.MAKER1,
    condition: () => true
  },
  {
    id: TUTORIAL_STATE.WRAPPER,
    condition: () => Currency.money.gte(800)
  },
  {
    id: TUTORIAL_STATE.STUFFING,
    condition: () => Currency.money.gte(3e3)
  },
  {
    id: TUTORIAL_STATE.COLLECTION,
    condition: () => PlayerProgress.collectionUnlocked()
  }
];

export const Tutorial = {

  isActive(atState) {
    return player.records.fullGameCompletions === 0 && ui.view.tutorialState === atState && ui.view.tutorialActive;
  },

  // This will remain visible until the first dimboost is purchased. However, since the tutorial state generally
  // only visually updates whenever the UI elements need changing, we need to explicitly check boost count or else
  // this will remain visible until a galaxy can be purchased
  emphasizeH2P() {
    const hasFirstWrapper = player.tutorialState > TUTORIAL_STATE.WRAPPER || player.wrapper > 0;
    return player.records.fullGameCompletions === 0 && !hasFirstWrapper;
  },

  // Turns off the visual effect
  turnOffEffect(fromState) {
    if (fromState !== player.tutorialState) return;
    player.tutorialActive = false;
    ui.view.tutorialActive = false;
    // Check if we can immediately enter next tutorial state. This is needed
    // to correctly handle buying dimension 2 + tickspeed in the same tick,
    // for example.
    this.tutorialLoop();
  },

  // Moves on to the next tutorialState, but only if parameter is current state.
  moveOn(fromState) {
    if (fromState !== player.tutorialState) return;
    player.tutorialState++;
    ui.view.tutorialState++;
    player.tutorialActive = true;
    ui.view.tutorialActive = true;
  },

  tutorialLoop() {
    const nextState = tutorialStates.find(o => o.id === player.tutorialState + 1);
    if (nextState && nextState.condition()) this.moveOn(player.tutorialState);
  }
};
