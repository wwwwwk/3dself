<template>
  <div class="city-container" ref="cityContainer"></div>
  <!-- <GeneralView></GeneralView>
  <PipeEquipment></PipeEquipment>
  <PipePosition></PipePosition>
  <PipeMessage></PipeMessage> -->
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { init, animate, destroy, baseThree } from "./glrender";
import { btnData } from "@/components/Layout/ToolBar/main";
// import GeneralView from "@/components/CityPage/GeneralView/index.vue";
// import PipeEquipment from "@/components/CityPage/PipeEquipment/index.vue";
// import PipePosition from "@/components/CityPage/PipePosition/index.vue";
// import PipeMessage from "@/components/CityPage/PipeMessage/index.vue";
// export default {
//   name: "City",
//   setup() {
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

//     return { cityContainer, GeneralView };
//   },
//   // components: {GeneralView}
// };
</script>
<style lang="less" scoped>
.city-container {
  width: 100%;
  height: 100%;
}
</style>
