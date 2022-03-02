<template>
  <div class="pipePositionContainer">
    <div>管线所属污水片区</div>
    <div id="charts" ref="chartsContainer"></div>
  </div>
</template>
<script lang="ts" setup>
import {ref, onMounted, onBeforeUnmount} from "vue";
import * as echarts from "echarts";

const chartsContainer = ref();

let chartsInstance = null;

onMounted(()=>{
  init();
  setChart();
});

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
  chartsInstance = echarts.init(chartsContainer.value);
};

const setChart = () => {
  let option = {
        tooltip: {
          // trigger: "item",
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 10,
          data: [
            "a截污片区",
            "b截污片区",
            "c截污片区",
            "d截污片区",
          ],
          textStyle: {
            color: "rgba(198, 227, 255, 0.5)",
          },
        },
        series: [
          {
            name: "里程",
            type: "pie",
            radius: ["45%", "70%"],
            center: ["40%", "50%"],
            // avoidLabelOverlap: false,
            label: {
              show: true,
              // position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [
              {
                value: 230.22,
                name: "a截污片区",
                itemStyle: {
                  color: "rgba(255, 193, 94, 1)",
                },
              },
              {
                value: 519.1,
                name: "b截污片区",
                itemStyle: {
                  color: "rgba(255, 132, 0, 1)",
                },
              },
              {
                value: 324.16,
                name: "c截污片区",
                itemStyle: {
                  color: "rgba(255, 67, 90, 1)",
                },
              },
              {
                value: 118.73,
                name: "d截污片区",
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

</script>
<style scoped>
.pipePositionContainer {
  width: 424px;
  height: 200px;
  background-color: rgba(0, 33, 81, 0.8);
  position: absolute;
  top: 366px;
  left: 2px;
  padding: 13px 20px;
  box-sizing: border-box;
}
.pipePositionContainer > div:first-child {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 244, 246, 1);
  height: 22px;
  line-height: 22px;
  text-align: left;
}
#charts {
  width: 100%;
  height: calc(100% - 22px);
}
</style>
