import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: 'CollectionGrid',
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: 0,
      isActive: false,
      canActivate: false,
      hasTutorial: false,
      cap: 0
    }
  },
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
  methods: {
    update() {
      const collection = this.collection;
      this.amount = collection.totalAmount;
      this.isActive = collection.isActive;
      this.canActivate = collection.canActivate;
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.COLLECTION);
      this.cap = collection.cappedAmount;
    },
    activate() {
      this.collection.activate();
    }
  },
  computed: {
    gridClass() {
      return {
        'o-collection-grid': true,
        'o-collection-grid--inactive': !this.isActive,
        'o-collection-grid--locked': !this.isUnlocked
      }
    },
    gridStyle() {
      const unknownUrl = './images/collections/unknown.png';
      return {
        backgroundImage: `url(${this.isUnlocked ? (this.collection.url || unknownUrl) : unknownUrl})`
      }
    },
    textStyle() {
      return {
        color: this.collection.rarity === "common" ? "var(--color-text)" : `var(--color-rarity-${this.collection.rarity})`
      }
    },
    config() {  
      return this.collection.config;
    },
    isUnlocked() {
      return this.amount > 0 || PlayerProgress.steamerUnlocked();
    },
    btnStyle() {
      return {
        'o-activate-btn': true,
        'o-activate-btn--disabled': !this.canActivate,
        "tutorial--glow": this.canActivate && this.hasTutorial,
      }
    },
    amountText() {
      const under1000 = player.break ? 2 : 0;
      const base = format(this.amount, 2, under1000);
      if (Number.isFinite(this.cap)) {
        return `${base}/${format(this.cap, 2, under1000)}`;
      }
      return `${base}/${$t("infinity")}`;
    },
    label() {
      return this.config.softcap && this.amount >= this.config.softcap ? "softCapped" : "current" ;
    }
  },
  template: `
    <div
    :class='gridClass'
    @click.shift.exact='activate'
    >
      <div
      :style='gridStyle'
      class='o-collection-image'
      />
       <div v-if='this.collection.isUnlocked'
        :style='textStyle'
        class="o-collection-info"
        >
         <div class='o-collection-name'>
          {{ collection.name }} ({{ collection.rarityName }})
        </div>
        <div>
          {{ $t("curAmount") }}: {{ amountText }}
        </div>
          
          <DescriptionDisplay
            :config='config'
          />
          <br>
          <EffectDisplay
            :config='config'
            :label="label"
          />
        <div class="o-collection-activate-btn-container">
          <div
          @click='activate'
          :class='btnStyle'
          >
            {{ $t("activate") }}
            <div
            v-if="hasTutorial"
            class="fas fa-circle-exclamation l-notification-icon"
            />
          </div>
        </div>
      </div>
      <div v-else class='o-collection-name--locked'>
        {{ $t("questions") }}
      </div>
    </div>
  `
}