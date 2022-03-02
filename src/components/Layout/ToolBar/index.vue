<template>
  <div class="toolbar-container">
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
      @click.stop.prevent=""
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
      :title="btnData.distanceBufferBtn.name"
      @click.stop.prevent=""
      v-if="toolbarState.state.distanceBufferControl"
    >
      <img
        :src="
          btnData.distanceBufferBtn.isChecked
            ? btnData.distanceBufferBtn.checkSrc
            : btnData.distanceBufferBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.lightMaskBtn.name"
      @click.stop.prevent=""
      v-if="toolbarState.state.lightMaskControl"
    >
      <img
        :src="
          btnData.lightMaskBtn.isChecked
            ? btnData.lightMaskBtn.checkSrc
            : btnData.lightMaskBtn.uncheckSrc
        "
      />
    </div>
    <div
      :title="btnData.citySpriteBtn.name"
      @click.stop.prevent=""
      v-if="toolbarState.state.citySpriteControl"
    >
      <img
        :src="
          btnData.citySpriteBtn.isChecked
            ? btnData.citySpriteBtn.checkSrc
            : btnData.citySpriteBtn.uncheckSrc
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
} from "./main";

const toolbarState = inject("toolbarState");
const currentScene: any = inject("currentScene");

const rotateControlMethod = () => {
  subRotateControl();
  if (btnData.rotateBtn.isChecked) {
    currentScene.scene.startRotate();
  } else {
    currentScene.scene.destroyRotate();
  }
};
</script>
<style lang="less" scoped>
.toolbar-container {
  width: 40px;
  height: fit-content;
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  > div {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
