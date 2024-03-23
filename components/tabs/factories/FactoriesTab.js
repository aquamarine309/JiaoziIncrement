import FactoryRow from './FactoryRow.js';
import MixtureInfo from "./MixtureInfo.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: 'FactoriesTab',
  components: {
    FactoryRow,
    MixtureInfo,
    PrimaryButton
  },
  data() {
    return {
      mixtures: new Decimal(0),
      maxTier: 0,
      isAutobuyerUnlocked: false
    }
  },
  methods: {
    update() {
      this.mixtures = Currency.mixtures.value;
      this.maxTier = (PlayerProgress.simulationUnlocked() || Factory(9).isUnlocked) ? 9 : Factories.next().tier;
      this.isAutobuyerUnlocked = SimulationMilestone.autoFactory.isReached;
    },
    maxAll() {
      Factories.buyMax();
    },
    toggleAllAutobuyers() {
      toggleAllFactories();
    }
  },
  computed: {
    mixtureTypes() {
     return MixtureTypes.all;
    },
    names() {
      return makeEnumeration(this.mixtureTypes.map(v => $t(v.name)));
    }
  },
  template: `
    <div>
      <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="maxAll"
      >
        {{ $t("maxAll") }}
      </PrimaryButton>
      <PrimaryButton
      v-if="isAutobuyerUnlocked"
      class="o-primary-btn--subtab-option"
      @click="toggleAllAutobuyers"
      >
        {{ $t("toggleAuto") }}
      </PrimaryButton>
      <div class="o-factories-info">
        <p>
          {{ $t("youHave") }}
          <span class="o-mixtures__accent">{{ format(mixtures, 2) }}</span>
          {{ pluralize($t("mixture"), mixtures) }}
        </p>
        <p>
          {{ $t("mixturesInfo", [names]) }}
        </p>
        <MixtureInfo 
        v-for="type in mixtureTypes" 
        :key="type.id"
        :mixture="type"
        />
      </div>
      <div
      class='o-factories-container'
      >
        <FactoryRow
        v-for='tier in maxTier'
        :key='tier'
        :tier='tier' />
      </div>
    </div>
  `
}