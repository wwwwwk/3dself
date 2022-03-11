<template>
  <div :class="toolbarState.state.videoFusion?'toolbar-container right': 'toolbar-container'">
    <div
      :title="btnData.routeBtn.name"
      @click.stop.prevent="changeRoute"
      v-if="toolbarState.state.routeControl"
    >
      <img
        :src="
          btnData.routeBtn.isChecked
            ? btnData.routeBtn.checkSrc
            : btnData.routeBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.rotateBtn.name"
      @click.stop.prevent="rotateControlMethod"
      v-if="toolbarState.state.rotateControl"
    >
      <img
        :src="
          btnData.rotateBtn.isChecked
            ? btnData.rotateBtn.checkSrc
            : btnData.rotateBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.initBtn.name"
      @click.stop.prevent="moveControl"
      v-if="toolbarState.state.initControl"
    >
      <img
        :src="
          btnData.initBtn.isChecked
            ? btnData.initBtn.checkSrc
            : btnData.initBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.heatmapBtn.name"
      @click.stop.prevent="changeHeatmap"
      v-if="toolbarState.state.heatmapControl"
    >
      <img
        :src="
          btnData.heatmapBtn.isChecked
            ? btnData.heatmapBtn.checkSrc
            : btnData.heatmapBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.flyLineBtn.name"
      @click.stop.prevent="changeFlyline"
      v-if="toolbarState.state.flyLineControl"
    >
      <img
        :src="
          btnData.flyLineBtn.isChecked
            ? btnData.flyLineBtn.checkSrc
            : btnData.flyLineBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.featurePointBtn.name"
      @click.stop.prevent="changeFeaturePoint"
      v-if="toolbarState.state.featurePointControl"
    >
      <img
        :src="
          btnData.featurePointBtn.isChecked
            ? btnData.featurePointBtn.checkSrc
            : btnData.featurePointBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.videoFusionBtn.name"
      @click.stop.prevent="changeVideoFusionState"
      v-if="toolbarState.state.videoFusion"
    >
      <img
        :src="
          btnData.videoFusionBtn.isChecked
            ? btnData.videoFusionBtn.checkSrc
            : btnData.videoFusionBtn.uncheckSrc
        "
      />
    </div>
  </div>
  <router-view></router-view>
</template>
<script lang="ts" setup>
import { inject } from "vue";
import {
  btnData,
  subRotateControl,
  changeRoute,
  changeHeatmap,
  changeFlyline,
  changeFeaturePoint,
  changeVideoFusionState,
} from "./main";

const toolbarState: any = inject("toolbarState");
const currentScene: any = inject("currentScene");

// let rightDistance: string;
// watch(toolbarState, () => {
//   rightDistance = toolbarState.state.videoFusion ? "370px" : "20px";
// });

const rotateControlMethod = () => {
  subRotateControl();
  if (btnData.rotateBtn.isChecked) {
    currentScene.scene.startRotate();
  } else {
    currentScene.scene.destroyRotate();
  }
};

const moveControl = () => {
  currentScene.scene.movetoInit();
};
</script>
<style lang="less" scoped>
.toolbar-container {
  width: 40px;
  height: fit-content;
  position: absolute;
  top: 20px;
  // right: v-bind("rightDistance");
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  > div {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.right {
  right: 370px;
}
</style>
