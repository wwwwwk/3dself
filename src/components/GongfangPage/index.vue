<template>
<div class="gongfang-container" ref="gongfangContainer"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { init, animate, destroy, baseThree } from "./glrender";
import { btnData } from "@/components/Layout/ToolBar/main";

const setCurrentSceneState: any = inject("setCurrentSceneState");

const gongfangContainer = ref();

onMounted(async () => {
  btnData.rotateBtn.isChecked = true;
  init(gongfangContainer.value);
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
.gongfang-container {
  width: 100%;
  height: 100%;
}
</style>
