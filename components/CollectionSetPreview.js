import CollectionComponent from "./CollectionComponent.js";

export default {
  name: "CollectionSetPreview",
  components: {
    CollectionComponent
  },
  props: {
    activeBits: {
      type: Number,
      required: false,
      default: 0
    },
    collections: {
      type: Array,
      required: false
    },
    label: {
      type: String,
      required: false
    }
  },
  computed: {
    activeCollections() {
      if (this.collections) return this.collections;
      const result = [];
      for (let i = 0; i < Collection.length; i++) {
        if ((this.activeBits & (1 << Collection[i].id)) !== 0) {
          result.push(Collection[i]);
        }
      }
      return result;
    },
    showComponent() {
      return this.activeCollections.length > 0;
    },
    voidText() {
      return $t("void");
    },
    displayLabel() {
      return this.label ?? $t("collocation_");
    }
  },
  template: `
    <div class="l-collection-set-preview">
      <span class="l-collection-set-preview--label" v-if="displayLabel">{{ displayLabel }}</span>
      <div v-if="showComponent">
        <CollectionComponent
        v-for="collection in activeCollections"
        :key="collection.id"
        :collection="collection"
        />
      </div>
      <div v-else class="o-collection-set-preview--void">
        {{ voidText }}
      </div>
    </div>
  `
}