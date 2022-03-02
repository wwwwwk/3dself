<template>
  <div class="city-main">
    <City></City>
  </div>
</template>
<script lang="ts">
import { inject } from "vue";
import City from "@/components/CityPage/index.vue";
export default {
  name: "city",
  components: { City },
  setup() {
    const setToolbarState: any = inject("setToolbarState");
    setToolbarState({
      routeControl: true,
      rotateControl: true,
      initControl: true,
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
.city-main {
  width: 100%;
  height: 100%;
}
</style>
