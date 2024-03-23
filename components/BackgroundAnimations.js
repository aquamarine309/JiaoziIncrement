import BlobSnowflakes from "./BlobSnowflakes.js";

export default {
  name: "BackgroundAnimations",
  components: {
    BlobSnowflakes
  },
  data() {
    return {
      blob: false
    };
  },
  methods: {
    update() {
      this.blob = Theme.currentName() === "S11";
    }
  },
template: `
  <div
    id="ui-background-animations"
    class="l-background-animations"
  >
    <BlobSnowflakes v-if="blob" />
  </div>
`
}