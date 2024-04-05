export default {
  name: "CollectionComponent",
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  computed: {
    componentStyle() {
      const unknownUrl = './images/collections/unknown.png';
      return {
        "border-color": this.collection.rarity === "common" ?
          "var(--color-text)" :
          `var(--color-rarity-${this.collection.rarity})`,
        "background-image": `url(${this.collection.isUnlocked ? (this.collection.url || unknownUrl) : unknownUrl})`
      }
    },
    effectTooltip() {
      return `${this.collection.name}: ${this.collection.config.description()}`;
    }
  },
  template: `
    <div
      class="c-collection-component"
      :style="componentStyle"
      :ach-tooltip="effectTooltip"
    />
  `
}