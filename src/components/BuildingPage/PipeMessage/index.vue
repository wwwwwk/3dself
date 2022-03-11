<template>
  <div class="pipeMessageContainer">
    <div>
      <div
        :class="isChecked[0] ? 'isChecked' : ''"
        @click.prevent.stop="typeToggle(0, '管径统计')"
      >
        管径统计
      </div>
      <div
        :class="isChecked[1] ? 'isChecked' : ''"
        @click.prevent.stop="typeToggle(1, '材质统计')"
      >
        材质统计
      </div>
    </div>
    <div id="chart" ref="chartsContainer"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import * as echarts from "echarts";

let chartsInstance = null;

const chartsContainer = ref();

const isChecked = reactive({
  check: [true, false],
});

const pipePathData = [
  {
    key: "≤200",
    value: 32.68,
  },
  {
    key: "≤300",
    value: 131.99,
  },
  {
    key: "≤400",
    value: 34.06,
  },
  {
    key: "≤500",
    value: 78.1,
  },
  {
    key: "≤600",
    value: 89.89,
  },
  {
    key: "≤700",
    value: 12.24,
  },
  {
    key: "≤800",
    value: 232.12,
  },
  {
    key: "≤1000",
    value: 309.45,
  },
  {
    key: "≤2000",
    value: 232.6,
  },
  {
    key: "≤3000",
    value: 18.6,
  },
  {
    key: "≤4000",
    value: 22.6,
  },
  {
    key: ">4000",
    value: 4.88,
  },
];

onMounted(()=>{
  init();
  setBarCharts(pipePathData);
})

onBeforeUnmount(()=>{
  if(chartsInstance) {
    chartsInstance.dispose;
    chartsInstance = null;
  }
});

const init = () => {
  if (chartsInstance) {
    chartsInstance.dispose();
    chartsInstance = null;
  }
  chartsInstance = echarts.init(chartsContainer.value, "dark");
};

const setBarCharts = (targetData) => {
  chartsInstance.clear();
  let option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      top: "3%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      axisLine: {
        lineStyle: {
          color: "rgba(143, 198, 235, 0.8)",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["rgba(108, 147, 176, 0.3)"],
        },
      },
    },
    yAxis: {
      type: "category",
      data: [],
      axisLine: {
        lineStyle: {
          color: "rgba(143, 198, 235, 0.8)",
        },
      },
    },
    series: [
      {
        type: "bar",
        data: [],
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "rgba(0, 153, 157, 0.3)" }, //柱图渐变色
              { offset: 1, color: "rgba(51, 179, 136, 0.7)" }, //柱图渐变色
            ]),
          },
        },
      },
    ],
  };
  targetData.forEach((item) => {
    option.yAxis.data.push(item.key);
    option.series[0].data.push(item.value);
  });

  chartsInstance.setOption(option);
};

const setPieCharts = () => {
  chartsInstance.clear();
  let option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      data: ["PE", "PVC", "钢", "砼", "铸铁", "砖", "其他"],
      textStyle: {
        color: "rgba(198, 227, 255, 0.5)",
      },
    },
    series: [
      {
        name: "材质",
        type: "pie",
        radius: ["45%", "70%"],
        // radius: [50, 110],
        center: ["45%", "50%"],
        // avoidLabelOverlap: false,
        label: {
          show: true,
          fontSize: "20",
          fontWeight: "bold",
        },
        labelLine: {
          length: 10,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
          },
        },
        data: [
          {
            value: 42.41,
            name: "PE",
            itemStyle: {
              color: "rgba(255, 193, 94, 1)",
            },
          },
          {
            value: 75.11,
            name: "PVC",
            itemStyle: {
              color: "rgba(255, 132, 0, 1)",
            },
          },
          {
            value: 0.3,
            name: "钢",
            itemStyle: {
              color: "rgba(43, 123, 255, 1)",
            },
          },
          {
            value: 1079.67,
            name: "砼",
            itemStyle: {
              color: "rgba(255, 67, 90, 1)",
            },
          },
          {
            value: 0.82,
            name: "铸铁",
            itemStyle: {
              color: "rgba(0, 205, 0, 1)",
            },
          },
          {
            value: 0.58,
            name: "砖",
            itemStyle: {
              color: "rgba(144, 87, 255, 1)",
            },
          },
          {
            value: 0.32,
            name: "其他",
            itemStyle: {
              color: "rgba(0, 205, 0, 1)",
            },
          },
        ],
      },
    ],
  };
  chartsInstance.setOption(option);
};

const typeToggle = (index, type) => {
  for (let i = 0; i < isChecked.check.length; i++) {
    if (i == index) isChecked.check[i] = true;
    else isChecked.check[i] = false;
  }
  if (type == "管径统计") setBarCharts(pipePathData);
  else setPieCharts();
};

</script>
<style scoped>
@media screen and (max-height: 1077px) {
  .pipeMessageContainer {
    height: 260px !important;
  }
}
.pipeMessageContainer {
  width: 424px;
  height: 29%;
  background-color: rgba(0, 33, 81, 0.8);
  position: absolute;
  top: calc(29% + 398px);
  left: 2px;
  padding: 12px 20px;
  box-sizing: border-box;
}
.pipeMessageContainer > div:first-child {
  width: 100%;
  height: 26px;
}
.pipeMessageContainer > div:first-child > div {
  width: 80px;
  height: 26px;
  float: left;
  border-radius: 2px;
  border: 1px solid rgba(108, 147, 176, 0.5);
  font-size: 14px;
  color: rgba(143, 198, 235, 1);
  line-height: 25px;
  margin-right: 10px;
  cursor: pointer;
  text-align: center;
}
.isChecked {
  background-color: rgba(19, 131, 215, 1);
}
#chart {
  width: 100%;
  height: calc(100% - 46px);
  margin-top: 15px;
}
</style>
