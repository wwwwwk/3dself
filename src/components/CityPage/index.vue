<template>
  <div class="city-container" ref="cityContainer"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { init, animate, destroy, baseThree } from "./glrender";
import { btnData } from "@/components/Layout/ToolBar/main";
const cityContainer = ref();

const setCurrentSceneState: any = inject("setCurrentSceneState");

onMounted(() => {
  init(cityContainer.value);
  setCurrentSceneState(baseThree);
  animate();
  btnData.rotateBtn.isChecked = true;
  baseThree.startRotate();
});

onBeforeUnmount(() => {
  destroy();
});

</script>
<style lang="less" scoped>
.city-container {
  width: 100%;
  height: 100%;
}
</style>
