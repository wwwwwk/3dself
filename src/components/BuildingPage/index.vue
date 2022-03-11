<template>
  <div class="building-container" ref="buildingContainer"></div>
  <GeneralView></GeneralView>
  <PipeEquipment></PipeEquipment>
  <PipePosition></PipePosition>
  <PipeMessage></PipeMessage>
  <video id="videoDiv" autoplay loop muted>
    <source src="../../assets/building/video.mp4">
  </video>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { init, animate, destroy, baseThree } from "@/components/BuildingPage/glrender";
import GeneralView from "@/components/BuildingPage/GeneralView/index.vue";
import PipeEquipment from "@/components/BuildingPage/PipeEquipment/index.vue";
import PipePosition from "@/components/BuildingPage/PipePosition/index.vue";
import PipeMessage from "@/components/BuildingPage/PipeMessage/index.vue";
import { btnData } from "@/components/Layout/ToolBar/main";

const setCurrentSceneState: any = inject("setCurrentSceneState");

const buildingContainer = ref();

onMounted(() => {
  init(buildingContainer.value);
  animate();
  setCurrentSceneState(baseThree);
  // console.log(currentScene.scene);
  baseThree.startRotate();
  btnData.rotateBtn.isChecked = true;
});

onBeforeUnmount(() => {
  destroy();
});
</script>
<style lang="less" scoped>
.building-container {
  width: 100%;
  height: 100%;
}
#videoDiv {
  display: none;
}
</style>
