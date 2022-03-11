<template>
  <BuildingPage></BuildingPage>
</template>
<script lang="ts">
import BuildingPage from "@/components/BuildingPage/index.vue";
import { inject } from "vue";
export default {
  name: "building",
  components: { BuildingPage },
  setup() {
    const setToolbarState: any = inject("setToolbarState");
    setToolbarState({
      routeControl: true,
      rotateControl: true,
      initControl: true,
      heatmapControl: false,
      flyLineControl: false,
      featurePointControl: false,
      videoFusion: true,
    });
  },
};
</script>
<style lang="less" scoped>
.div {
  width: 100%;
  height: 30px;
}
</style>
