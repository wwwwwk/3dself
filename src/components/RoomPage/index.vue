<template>
  <div class="room-container" ref="roomContainer"></div>
</template>
<script lang="ts">
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import {
  init,
  animate,
  destroy,
  baseThree,
} from "@/components/RoomPage/glrender";
// import { btnData } from "@/components/Layout/ToolBar/main";
export default {
  name: "RoomPage",
  setup() {
    const setPopupShowState = inject("setPopupShowState");
    const setCurrentSceneState: any = inject("setCurrentSceneState");

    const roomContainer = ref();

    onMounted(async () => {
      await init(roomContainer.value, setPopupShowState);
      setCurrentSceneState(baseThree);
      animate();
      // baseThree.startRotate();
      // btnData.rotateBtn.isChecked = true;
    });

    onBeforeUnmount(() => {
      destroy();
    });

    return { roomContainer };
  },
};
</script>
<style lang="less" scoped>
.room-container {
  width: 100%;
  height: 100%;
}
</style>
