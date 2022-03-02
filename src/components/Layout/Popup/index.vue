<template>
  <div class="ground-container">
    <div>
      <span>比率</span>
      <span @click.prevent.stop="close">x</span>
    </div>
    <div id="charts" ref="chartsContainer"></div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
const option = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  color: ["#225bfd", "#824ef8", "#fc638c", "#ff8347", "#72cc8c"],
  legend: {
    data: ["a", "b", "c", "d", "e"],
    textStyle: {
      color: "#ccc",
      fontSize: 16,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      data: ["1975", "1990", "2000", "2010", "2014", "2015", "2018"],
    },
  ],
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#6C93B0",
        },
      },
    },
  ],
  series: [
    {
      name: "a",
      type: "line",
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(34, 91, 253, 0.5)" },
          { offset: 1, color: "rgba(34, 91, 253, 0)" },
        ]),
      },
      data: [5.36, 15.48, 20.11, 27.67, 27.93, 33.53, 34.72],
      lineStyle: {
        color: "#225bfd", //改变折线颜色
      },
    },
    {
      name: "b",
      type: "line",
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(130, 78, 248, 0.5)" },
          { offset: 1, color: "rgba(130, 78, 248, 0)" },
        ]),
      },
      data: [2.24, 3.45, 5.55, 7.92, 8.74, 13.73, 15.68],
      lineStyle: {
        color: "#824ef8", //改变折线颜色
      },
    },
    {
      name: "c",
      type: "line",
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(252, 99, 140, 0.5)" },
          { offset: 1, color: "rgba(252, 99, 140, 0)" },
        ]),
      },
      data: [2.84, 8.04, 11.78, 15.49, 14.74, 21.74, 22.48],
      lineStyle: {
        color: "#fc638c", //改变折线颜色
      },
    },
    {
      name: "d",
      type: "line",
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255, 131, 71, 0.5)" },
          { offset: 1, color: "rgba(255, 131, 71, 0)" },
        ]),
      },
      data: [5.12, 6.97, 10.21, 13.87, 15.12, 24.79, 29.28],
      lineStyle: {
        color: "#ff8347", //改变折线颜色
      },
    },
    {
      name: "e",
      type: "line",
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(155, 255, 5, 0.5)" },
          { offset: 1, color: "rgba(0, 188, 193, 0)" },
        ]),
      },
      data: [1.97, 5.66, 8.26, 10.68, 14.11, 22.38, 26.57],
      lineStyle: {
        color: "#72cc8c", //改变折线颜色
      },
    },
  ],
};

const setPopupShowState: any = inject("setPopupShowState");

let charts: any;
const chartsContainer = ref();
const initCharts = () => {
  charts = echarts.init(chartsContainer.value);
};
const setCharts = () => {
  charts.setOption(option);
};
const destroy = () => {
  if (charts) {
    charts.dispose();
    charts = null;
  }
};

const close = () => {
  setPopupShowState(false);
};

onMounted(() => {
  initCharts();
  setCharts();
});

onBeforeUnmount(() => {
  destroy();
});
</script>
<style scoped lang="less">
.ground-container {
  position: absolute;
  bottom: 8px;
  transform: translateX(-50%);
  left: 50%;
  width: 630px;
  height: 300px;
  background-color: rgba(0, 62, 112, 0.8);
}
.ground-container > div:first-child {
  box-sizing: border-box;
  height: 9%;
  width: 100%;
  padding: 10px 19px;
  font-size: 21px;
  display: flex;
  justify-content: space-between;
  > span {
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 244, 246, 1);
    line-height: 21px;
    float: left;
  }
  > span:last-child {
    cursor: pointer;
  }
}
#charts {
  margin-top: 2%;
  height: 85%;
  width: 100%;
}
</style>
