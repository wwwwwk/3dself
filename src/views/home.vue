<template>
  <div class="home-main">
    <HomePage></HomePage>
  </div>
</template>
<script lang="ts">
import { inject } from "vue";
import HomePage from "@/components/HomePage/index.vue";
export default {
  name: "Home",
  components: { HomePage },
  setup() {
    const setToolbarState: any = inject("setToolbarState");
    setToolbarState({
      routeControl: false,
      rotateControl: false,
      initControl: false,
      heatmapControl: false,
      flyLineControl: false,
      featurePointControl: false,
      distanceBufferControl: false,
      lightMaskControl: false,
      citySpriteControl: false
    });
  },
};
</script>
<style lang="less" scoped>
.home-main {
  width: 100%;
  height: 100%;
}
</style>
