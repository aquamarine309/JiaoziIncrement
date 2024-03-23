import { DC } from "../constants.js";

const abbreviations = [
  {
    name: "Steamer Coins",
    abbr: "SC",
    condition: () => PlayerProgress.steamerUnlocked()
  },
  {
    name: "Core Dumpling",
    abbr: "CrD",
    condition: () => PlayerProgress.simulationUnlocked()
  }
]

const abbreviationsText = function() {
  const abbreviationsRows = [];
  for (let i = 0; i < abbreviations.length; i++) {
    if (abbreviations[i].condition()) {
      abbreviationsRows.push(`- <b>${abbreviations[i].abbr}</b>: ${abbreviations[i].name}<br>`);
    }
  }
  return abbreviationsRows.join("\n");
}

export const h2p = {
  tabs: [
    {
      name: "Common Abbreviations",
      isUnlocked: () => true,
      info: () => {
        return `
          Many resources within the game may appear in an abbreviated format as text in order to save space. This How to
          Play entry will update itself with additional entries for new resources as you encounter them for the first time.
          <br>
          ${abbreviationsText()}
        `
      },
      tags: ["attreviation"]
    }
  ]
};

(function() {
  for (let i = 0; i < h2p.tabs.length; i++) {
    const tab = h2p.tabs[i];
    tab.id = i;
    if (tab.alias === undefined) tab.alias = tab.name;

    tab.searchTermsRelevance = {};
  }

  const searchIndex = {};

  const addTerm = (term, tab) => {
    let entry = searchIndex[term];
    if (entry === undefined) {
      entry = [];
      searchIndex[term] = entry;
    }
    if (entry.includes(tab)) return;
    entry.push(tab);
  };

  const addWord = (word, tab) => {
    const lowerCase = word.toLowerCase();
    for (let i = 0; i < lowerCase.length; i++) {
      const term = lowerCase.slice(0, i + 1);
      addTerm(term, tab);
      if (tab.searchTermsRelevance[term] === undefined) {
        tab.searchTermsRelevance[term] = ((i + 1) / lowerCase.length) ** 0.65;
      } else {
        tab.searchTermsRelevance[term] = Math.max(tab.searchTermsRelevance[term], ((i + 1) / lowerCase.length) ** 0.65);
      }
    }
  };

  const addPhrase = (phrase, tab) => {
    addWord(phrase, tab);
    for (const part of phrase.split(" ")) {
      addWord(part, tab);
    }
  };

  for (const tab of h2p.tabs) {
    addPhrase(tab.name, tab);
  }
  for (const tab of h2p.tabs) {
    for (const tag of tab.tags) {
      addPhrase(tag, tab);
    }
  }
  for (const tab of h2p.tabs) {
    addPhrase(tab.alias, tab);
  }

  const map2dToObject = function(arr, keyFun, valueFun) {
    const out = {};
    for (let idx1 = 0; idx1 < arr.length; idx1++) {
      for (let idx2 = 0; idx2 < arr[idx1].length; idx2++) {
        out[keyFun(arr[idx1][idx2], idx1, idx2)] = valueFun(arr[idx1][idx2], idx1, idx2);
      }
    }
    return out;
  };

  // Very suboptimal code coming up. If anybody has a better solution, PLEASE, implement it.
  const keyboardify = keybrd => map2dToObject(keybrd.split(",").map(str => str.split("")),
    key => key, (_key, x, y) => ({ x, y }));

  const qwerty = keyboardify(`1234567890,qwertyuiop,asdfghjkl,zxcvbnm`);
  const qwertz = keyboardify(`1234567890,qwertzuiop,asdfghjkl,yxcvbnm`);
  const azerty = keyboardify(`1234567890,azertyuiop,qsdfghjklm,wxcvbn`);
  const dvorak = keyboardify(`1234567890,'<>pyfgcrl,aoeuidhtns,;qjkxbmwvz`);
  const colemak = keyboardify(`1234567890,qwfpgjluy,arstdhneio,zxcvbkm`);
  const workman = keyboardify(`1234567890,qdrwbjfup,ashtgyneoi,zxmcvkl`);
  const qwprf = keyboardify(`1234567890,qwprfyukl,asdtghnioe,zxcvbjm`);

  const keyboards = [qwerty, qwertz, azerty, dvorak, colemak, workman, qwprf];

  const keyboardDist = function(a, b, keyboard) {
    const aPos = keyboard[a], bPos = keyboard[b];
    if (!aPos || !bPos) return 100;
    return Math.max(Math.abs(aPos.x - bPos.x), Math.abs(aPos.y - bPos.y));
  };

  // I copied this code based on OSA distance off wikipedia, with a few added changes.
  // The cost for "substitution" (third item of the first Math.min) is replaced from a static value
  // to a function which roughly estimates how likely the user is to mispress the key based on its
  // minimum distance from several common keyboard layouts.
  // I have no idea how the actual "distance" calculation works but as long as it does don't touch it.
  const howBadlyTypoedWithKeyboard = function(a, b, keyboard) {
    // If they're the same, skip all calculations
    if (a === b) return 0;
    const aLen = a.length;
    const bLen = b.length;
    // If they're way too different, don't bother
    if (Math.abs(aLen - bLen) > 3) return 100;
    // 2d Array with dimensions aLen + 1 x bLen + 1
    const d = new Array(aLen + 1).fill(0).map(() => new Array(bLen + 1).fill(0));

    for (let i = 0; i <= aLen; i++) {
      d[i][0] = i;
    }
    for (let i = 0; i <= bLen; i++) {
      d[0][i] = i;
    }

    for (let i = 1; i <= aLen; i++) {
      for (let j = 1; j <= bLen; j++) {
        const distance = keyboardDist(a[i - 1], b[j - 1], keyboard);
        const cost = distance === 0 ? 0 : 0.3 + distance * distance * 0.25;
        d[i][j] = Math.min(
          d[i - 1][j] + 0.55,
          d[i][j - 1] + 0.7,
          d[i - 1][j - 1] + cost
        );
      }
    }
    return d[aLen][bLen];
  };

  const howBadlyTypoed = function(a, b) {
    // Arbitrarily large number
    let minTypoed = 1e10;
    for (const keyboard of keyboards) {
      minTypoed = Math.min(minTypoed, howBadlyTypoedWithKeyboard(a, b, keyboard));
    }
    return minTypoed;
  };

  const specialChars = ["'", "\"", ",", "-", ".", "_"];

  const replaceSpecialChars = function(str) {
    let result = str;
    for (const i of specialChars) {
      result = result.replaceAll(i, "");
    }
    return result;
  };

  // There are a LOT of magic numbers in this code, mostly from arbitrary choices for "What number is large enough to
  // act as a placeholder for 'basically not found'?"
  // This will need some cleanup if possible.
  h2p.search = query => {
    const truncatedQuery = replaceSpecialChars(query);
    if (truncatedQuery === "") return h2p.tabs.map(x => ({ tab: x, relevance: 1.5 }));
    const searchTerms = truncatedQuery.toLowerCase().split(" ").filter(str => str !== "");

    // A higher "Relevance" value actually means it's further away from the search, important to keep in mind
    const relevances = Array.repeat(1e4, h2p.tabs.length);
    for (const searchWord of searchTerms) {
      const minimumRequirement = Math.min(searchWord.length - 0.9, 3) * 0.5;
      for (const searchIndexStr in searchIndex) {
        const typoThreshold = howBadlyTypoed(replaceSpecialChars(searchIndexStr), searchWord);
        if (typoThreshold < minimumRequirement) {
          for (const tab of searchIndex[searchIndexStr]) {
            const maxRelevance = tab.searchTermsRelevance[searchIndexStr];
            const decrease = Math.max(maxRelevance * 1.6 - 0.9, 0);
            relevances[tab.id] = Math.min(relevances[tab.id], Math.max(typoThreshold, 1 - maxRelevance) - decrease);
          }
        }
      }
    }
    const results = h2p.tabs.filter(x => relevances[x.id] < 0.9)
      .map(x => ({ tab: x, relevance: relevances[x.id] }));
    // Provide both the relevance and the tab itself

    // Sort by id first, then push more relevant results to top.
    results.sort((a, b) => a.tab.id - b.tab.id).sort((a, b) => a.relevance - b.relevance);
    // Provide both the relevance and the tab itself
    return results;
  };
}());
