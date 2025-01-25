import { deepmergeAll } from "../../deepmerge.js";

export const migrations = {
  patches: {
    2.1: player => {
      player.makers.push({
        amount: 0,
        bought: 0
      });
      player.auto.makers.all.push(Player.defaultStart.auto.makers.all[8]);
    },
    7.3: player => {
      if (player.concludes) {
        player.simulations = new Decimal(player.concludes);
      }
      const simulationUnlocked = player.simulations.gt(0);
      const steamerUnlocked = player.steamerCount.gt(0) || simulationUnlocked;
      const collectionUnlocked = player.bigResetCount.gt(0) || steamerUnlocked;
      let maxMakerTier = 0;
      if (!collectionUnlocked) {
        maxMakerTier = Math.max(player.makers.findIndex(m => m.amount.eq(0)), player.stuffing);
      } else if (!steamerUnlocked) {
        maxMakerTier = 4;

        //r22
        if (player.collections.every(c => c >= 1)) {
          player.achievementBits[1] |= 2;
        }
      } else if (!player.break && !simulationUnlocked) {
        maxMakerTier = 5;
      } else {
        maxMakerTier = 8;

        //r24
        player.achievementBits[1] |= 8;
      }

      //r11 - r18
      for (let i = 0; i < maxMakerTier; i++) {
        player.achievementBits[0] |= (1 << i);
      }

      //r21
      if (collectionUnlocked) {
        player.achievementBits[1] |= 1;
      }

      //r22 and r23
      if (steamerUnlocked) {
        player.achievementBits[1] |= 2;
        player.achievementBits[1] |= 4;
      }

      //r25
      if (player.break || simulationUnlocked) {
        player.achievementBits[1] |= 16;
      }

      //27
      if ((player.challenge.normal.completedBits & 1) !== 0 || simulationUnlocked) {
        player.achievementBits[1] |= 64;
      }

      //28
      if (player.challenge.normal.completedBits === 510 || simulationUnlocked) {
        player.achievementBits[1] |= 128;
      }

      //r31 - r34
      if (player.factories[0].isUnlocked || simulationUnlocked) {
        player.achievementBits[2] |= 1;
      }
      if (player.factories[3].isUnlocked || simulationUnlocked) {
        player.achievementBits[2] |= 2;
      }
      if (player.tasks && Object.values(player.tasks).every(t => t >= 1) || simulationUnlocked) {
        player.achievementBits[2] |= 4;
      }
      if (player.factories[7].isUnlocked || simulationUnlocked) {
        player.achievementBits[2] |= 8;
      }

      player.options.languages = Languages.base.name;
      delete player.concludes;
      delete player.sauses;

      for (let i = 0; i < 9; i++) {
        delete player.factories[i].cost;
      }

      const records = player.records;

      delete records.thisSimulation.bestSNmin;
      delete records.thisSimulation.bestSNminValue;
      delete player.GAME_VERSION;
      delete player.simulationNodes;
    },
    7.4: player => {
      if (player.cores.gte(5)) {
        player.challenge.normal.completedBits = 510;
      }
    },
    8: player => {
      if (typeof player.simulation.upgrades.review[0] === "number") return;

      delete player.simulation.upgrades.review.activeId;
      delete player.simulation.upgrades.review.purchases;
      delete player.simulation.upgrades.preview;
    },
    8.1: player => {
      player.options.lastOpenSubtab[7] = 
      Math.max(0, player.options.lastOpenSubtab[7] - 1);
    },
    8.11: player => {
      //RARE: (1 << 4) | (1 << 5)
      player.requirementChecks.simulation.allRare = player.activeColBits === 48;
    },
    8.12: player => {
      player.records.recentBigReset = Player.defaultStart.records.recentBigReset;
      player.records.recentSteamer = Player.defaultStart.records.recentSteamer;
      player.records.recentSimulation = Player.defaultStart.records.recentSimulation;
    }
  },
  prePatch(saveData) {
    saveData.version = saveData.version || 0;
  },
  patch(saveData, maxVersion) {
    this.prePatch(saveData);
    // This adds all the undefined properties to the save which are in player.js
    const player = deepmergeAll([Player.defaultStart, saveData]);
    const versions = Object.keys(this.patches).map(parseFloat).sort();
    let version;
    while ((version = versions.find(v => player.version < v && v < maxVersion)) !== undefined) {
      const patch = this.patches[version];
      patch(player);
      player.version = version;
    }
    return player;
  },

  patchPlayer(saveData) {
    return this.patch(saveData, Object.keys(migrations.patches).map(k => Number(k)).max() + 1);
  }
}