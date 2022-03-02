<template>
  <div class="building-container" ref="buildingContainer"></div>
  <GeneralView></GeneralView>
  <PipeEquipment></PipeEquipment>
  <PipePosition></PipePosition>
  <PipeMessage></PipeMessage>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { init, animate, destroy } from "@/components/BuildingPage/glrender";
import GeneralView from "@/components/CityPage/GeneralView/index.vue";
import PipeEquipment from "@/components/CityPage/PipeEquipment/index.vue";
import PipePosition from "@/components/CityPage/PipePosition/index.vue";
import PipeMessage from "@/components/CityPage/PipeMessage/index.vue";

const buildingContainer = ref();

onMounted(() => {
  init(buildingContainer.value);
  animate();
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
</style>
