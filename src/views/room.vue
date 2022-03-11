<template>
  <RoomPage></RoomPage>
  <Popup v-if="popupShow"></Popup>
</template>
<script lang="ts">
import { inject } from "vue";
import RoomPage from "@/components/RoomPage/index.vue";
import Popup from "@/components/Layout/Popup/index.vue";
export default {
  name: "room",
  components: { RoomPage, Popup },
  setup() {
    const setToolbarState: any = inject("setToolbarState");
    setToolbarState({
      routeControl: true,
      rotateControl: false,
      initControl: true,
      heatmapControl: false,
      flyLineControl: false,
      featurePointControl: false,
      videoFusion: false,
    });

    const popupShow = inject("popupShow");

    return { popupShow };
  },
};
</script>
<style lang="less" scoped>
.div {
  width: 100%;
  height: 30px;
}
</style>
