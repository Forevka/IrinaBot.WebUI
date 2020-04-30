<template>
  <div class="home-view">
      <img class="wc-image" src="https://pngimg.com/uploads/warcraft/warcraft_PNG70.png">
      <div class="label">
          <span class="label-text">
              Irina Host Bot 
          </span>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class HomeView extends Vue {

  constructor() {
    super();
  }
}
</script>

<style lang="scss" scoped>
.home-view {
}

.wc-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
}

.label {
    text-align: center;
    font-size: xxx-large;
}
</style>