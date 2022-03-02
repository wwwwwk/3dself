import { reactive, readonly, inject } from "vue";
import router from "@/router/index";

import {
  openHeatmap,
  closeHeatmap,
  openFlyline,
  closeFlyline,
  openFeaturePoint,
  closeFeaturePoint,
} from "@/components/Earth/glrender";

const btnData = reactive({
  // 通用
  routeBtn: {
    name: "路由",
    checkSrc: require("@/assets/toolbar/homes.png"),
    uncheckSrc: require("@/assets/toolbar/home.png"),
    isChecked: false,
  },
  rotateBtn: {
    name: "旋转控制",
    checkSrc: require("@/assets/toolbar/rotates.png"),
    uncheckSrc: require("@/assets/toolbar/rotate.png"),
    isChecked: true,
  },
  initBtn: {
    name: "初始位置",
    checkSrc: require("@/assets/toolbar/inits.png"),
    uncheckSrc: require("@/assets/toolbar/init.png"),
    isChecked: false,
  },
  // 地球
  heatmapBtn: {
    name: "热力图",
    checkSrc: require("@/assets/toolbar/heatmaps.png"),
    uncheckSrc: require("@/assets/toolbar/heatmap.png"),
    isChecked: false,
  },
  flyLineBtn: {
    name: "飞线图",
    checkSrc: require("@/assets/toolbar/heatmaps.png"),
    uncheckSrc: require("@/assets/toolbar/heatmap.png"),
    isChecked: false,
  },
  featurePointBtn: {
    name: "特征点图",
    checkSrc: require("@/assets/toolbar/heatmaps.png"),
    uncheckSrc: require("@/assets/toolbar/heatmap.png"),
    isChecked: false,
  },
  // 城市
  distanceBufferBtn: {
    name: "缓冲区图",
    checkSrc: require("@/assets/toolbar/heatmaps.png"),
    uncheckSrc: require("@/assets/toolbar/heatmap.png"),
    isChecked: false,
  },
  lightMaskBtn: {
    name: "光罩图",
    checkSrc: require("@/assets/toolbar/heatmaps.png"),
    uncheckSrc: require("@/assets/toolbar/heatmap.png"),
    isChecked: false,
  },
  citySpriteBtn: {
    name: "poi点",
    checkSrc: require("@/assets/toolbar/heatmaps.png"),
    uncheckSrc: require("@/assets/toolbar/heatmap.png"),
    isChecked: false,
  },
});

const useToolbarState = () => {
  // btnState
  const toolbaData = reactive({
    state: {
      routeControl: false,
      rotateControl: false,
      initControl: false,
      heatmapControl: false,
      flyLineControl: false,
      featurePointControl: false,
      distanceBufferControl: false,
      lightMaskControl: false,
      citySpriteControl: false,
    },
  });

  const setToolbarState = (payload: any) => {
    toolbaData.state = payload;
  };

  return { setToolbarState, toolbarState: readonly(toolbaData) };
};

const subRotateControl = () => {
  btnData.rotateBtn.isChecked = !btnData.rotateBtn.isChecked;
};

const changeRoute = () => {
  router.push("/");
};

const changeHeatmap = async () => {
  btnData.heatmapBtn.isChecked = !btnData.heatmapBtn.isChecked;

  if (btnData.heatmapBtn.isChecked) {
    await openHeatmap();
  } else {
    closeHeatmap();
  }
};

const changeFlyline = async () => {
  btnData.flyLineBtn.isChecked = !btnData.flyLineBtn.isChecked;

  if (btnData.flyLineBtn.isChecked) {
    await openFlyline();
  } else {
    closeFlyline();
  }
};

const changeFeaturePoint = async () => {
  btnData.featurePointBtn.isChecked = !btnData.featurePointBtn.isChecked;

  if (btnData.featurePointBtn.isChecked) {
    await openFeaturePoint();
  } else {
    closeFeaturePoint();
  }
};

export {
  btnData,
  useToolbarState,
  subRotateControl,
  changeRoute,
  changeHeatmap,
  changeFlyline,
  changeFeaturePoint,
};
