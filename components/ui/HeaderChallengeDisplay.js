import PrimaryButton from "../PrimaryButton.js";

export default {
  name: "HeaderChallengeDisplay",
  components: {
    PrimaryButton
  },
  data() {
    return {
      activityTokens: [],
      infinityUnlocked: false,
      showExit: false,
      exitText: "",
      resetCelestial: false,
      inPelle: false,
    };
  },
  computed: {
    parts() {
      return [
        {
          name: token => `${$t("nc")} ${token}`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.normal.current
},
];
    },
    activeChallengeNames() {
      const names = [];
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        names.push(part.name(token));
      }
      return names;
    },
    isVisible() {
      return this.steamerUnlocked || this.activeChallengeNames.length > 0;
    },
    challengeDisplay() {
      if (this.activeChallengeNames.length === 0) {
        return `${$t("universe")} (${$t("noActiveChalls")})`;
      }
      return this.activeChallengeNames.join(" + ");
    },
  },
  methods: {
    update() {
      this.steamerUnlocked = PlayerProgress.steamerUnlocked();
      this.activityTokens = this.parts.map(part => part.activityToken());
      // Dilation in Pelle can't be left once entered, but we still want to allow leaving more nested challenges
      this.showExit = this.activeChallengeNames.length !== 0;
      this.exitText = this.exitDisplay();
      this.resetCelestial = player.options.retryCelestial;
    },
    // Process exit requests from the inside out; Challenges first, then dilation, then Celestial Reality. If the
    // relevant option is toggled, we pass a bunch of information over to a modal - otherwise we immediately exit
    exitButtonClicked() {
      let names, clickFn;
      if (Player.isInAnyChallenge) {
        // Regex replacement is used to remove the "(X/Y)" which appears after ECs. The ternary statement is there
        // because this path gets called for NCs, ICs, and ECs
        const toExit = this.activeChallengeNames[this.activeChallengeNames.length - 1].replace(/\W+\(.*\)/u, "");
        names = { chall: toExit, normal: "" };
        clickFn = () => {
          const oldChall = Player.anyChallenge;
          Player.anyChallenge.exit();
          if (player.options.retryChallenge) oldChall.requestStart();
        }

        if (player.options.confirmations.exitChallenge) {
          Modal.exitChallenge.show(
          {
            challengeName: names.chall,
            normalName: names.normal,
            hasHigherLayers: this.activeChallengeNames.length > 1,
            exitFn: clickFn
          });
        } else {
          clickFn();
        }
      }
    },
    // Bring the player to the tab related to the innermost challenge
    textClicked() {
      if (this.activeChallengeNames.length === 0) return;

      // Iterating back-to-front and breaking ensures we get the innermost restriction
      let fullName = "",
        celestial = "";
      for (let i = this.activityTokens.length - 1; i >= 0; i--) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        fullName = part.name(token);
        celestial = part.tabName?.();
        break;
      }

      // Normal challenges are matched with an end-of-string metacharacter
      if (fullName.match(`^${$t("nc")}`)) Tab.challenges.normal.show(true);
    },
    exitDisplay() {
      if (Player.isInAnyChallenge) return player.options.retryChallenge ? $t("restart") : $t("exit");
    },
    textClassObject() {
      return {
        "l-challenge-display": true,
        "l-challenge-display--clickable": this.activeChallengeNames.length !== 0,
      };
    }
  },
  template: `<div
v-if="isVisible"
class="l-game-header__challenge-text"
>
<span
:class="textClassObject()"
@click="textClicked"
>
{{ $t("challHeader", [challengeDisplay]) }}
</span>
<span class="l-padding-line" />
<PrimaryButton
v-if="showExit"
@click="exitButtonClicked"
>
{{ exitText }}
</PrimaryButton>
</div>`
}