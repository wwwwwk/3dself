<template>
  <div class="earth-main">
    <Earth></Earth>
  </div>
</template>
<script lang="ts">
import { inject } from "vue";
import Earth from "@/components/Earth/index.vue";
export default {
  name: "earth",
  components: { Earth },
  setup() {
    const setToolbarState: any = inject("setToolbarState");
    setToolbarState({
      routeControl: true,
      rotateControl: true,
      initControl: true,
      heatmapControl: true,
      flyLineControl: true,
      featurePointControl: true,
      distanceBufferControl: false,
      lightMaskControl: false,
      citySpriteControl: false
    });
  },
};
</script>
<style lang="less" scoped>
.earth-main {
  width: 100%;
  height: 100%;
}
</style>
