<template>
  <div class="generalViewContainer">
    <div>
      <span>项目区面积</span>
      <div>
        <span>3436.23</span>
        <span>km<sup>2</sup></span>
      </div>
    </div>
    <img class="recLight1" :src="juxing82" />
    <img class="recLight2" :src="back3" />
    <div class="hewangStastic">
      <div>
        <span
          ><span><span></span></span></span
        ><span>河网统计</span>
      </div>
      <div class="hewangContent">
        <div>
          <span>584.15</span>
          <span>河网长度</span>
          <span>km</span>
          <img class="borderlt" :src="angleLt" />
          <img class="borderrt" :src="angleRt" />
          <img class="bottomLight" :src="juxing82" />
        </div>
        <div>
          <span>0.17</span>
          <span>河网密度</span>
          <span>km/km<sup>2</sup></span>
          <img class="borderlt" :src="angleLt" />
          <img class="borderrt" :src="angleRt" />
          <img class="bottomLight" :src="juxing82" />
        </div>
      </div>
    </div>

    <div class="shuiyuStastic">
      <div>
        <span
          ><span><span></span></span></span
        ><span>水域面积统计</span>
      </div>
      <div class="shuiyuContent">
        <div>
          <span>203.44</span>
          <span>水域面积</span>
          <span>km<sup>2</sup></span>
          <img class="borderlt" :src="angleLt" />
          <img class="borderrt" :src="angleRt" />
          <img class="bottomLight" :src="juxing82" />
        </div>
        <div>
          <span>5.92</span>
          <span>水面率</span>
          <span>%</span>
          <img class="borderlt" :src="angleLt" />
          <img class="borderrt" :src="angleRt" />
          <img class="bottomLight" :src="juxing82" />
        </div>
      </div>
    </div>

    <div class="heichouStastic">
      <div>
        <span
          ><span><span></span></span></span
        ><span>河段统计</span>
      </div>
      <div class="heichouContent">
        <div>
          <span>24</span>
          <span>数量</span>
          <span>条</span>
          <img class="borderlt" :src="angleLt" />
          <img class="borderrt" :src="angleRt" />
          <img class="bottomLight" :src="juxing82" />
        </div>
        <div>
          <span>80.7</span>
          <span>里程</span>
          <span>km</span>
          <img class="borderlt" :src="angleLt" />
          <img class="borderrt" :src="angleRt" />
          <img class="bottomLight" :src="juxing82" />
        </div>
      </div>
    </div>

    <div class="heichouTable">
      <span>图表详情</span>
    </div>
    <div class="resultTable">
      <div id="charts" ref="chartsContainer"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

import { getCountryUrl } from "@/api/city";
import { drakTheme } from "@/utils/chartsdarktheme";

const angleLt = require("@/assets/city/angle_lt.png");
const angleRt = require("@/assets/city/angle_rt.png");
const juxing82 = require("@/assets/city/juxing82.png");
const back3 = require("@/assets/city/back3.png");

echarts.registerTheme("dark", drakTheme);

const chartsContainer = ref();

let chartsInstance = null;

let options = null;

onMounted(async () => {
  init();
  await getData();
  // console.log(chartsContainer.value);
});

onBeforeUnmount(() => {
  if (chartsInstance) {
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
  options = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      top: "3%",
      left: "20%",
      bottom: "8%",
    },
    backgroundColor: "rgba(25, 47, 107, 0)",
    xAxis: {
      splitLine: {
        lineStyle: {
          // 使用深浅的间隔色
          color: "#444444",
        },
      },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          // 使用深浅的间隔色
          color: "#444444",
        },
      },
    },
    dataZoom: [
      {
        orient: "vertical",
        type: "inside",
        start: 90,
        end: 100,
      },
    ],
    series: [],
  };
};

const getData = async () => {
  const res = await getCountryUrl();
  // console.log(res);
  const result = res.data.features.map((item: any) => {
    return {
      name: item.attributes.COUNTRY,
      count: item.attributes.countOFCOUNTRY,
    };
  });

  result.sort((a, b) => {
    const value1 = a.count;
    const value2 = b.count;
    if (value1 < value2) return -1;
    if (value1 > value2) return 1;
    return 0;
  });

  const xData = [];
  const yData = [];
  result.forEach((item) => {
    yData.push(item.name);
    xData.push(item.count);
  });
  options.yAxis.data = yData;
  options.series = [
    {
      type: "bar",
      data: xData,
      smooth: 0.3,
    },
  ];
  chartsInstance.setOption(options);
};
</script>
<style lang="less" scoped>
.generalViewContainer {
  width: 360px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  background-color: rgba(0, 62, 112, 0.8);
  padding: 10px;
  box-sizing: border-box;
  > div:first-child {
    width: 100%;
    height: 29px;
    margin-top: 6px;
    text-align: left;
  }
}
.heichouTable {
  text-align: left;
  margin-top: 20px;
}
.generalViewContainer > div:first-child > span,
.heichouTable > span {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(0, 244, 246, 1);
  line-height: 29px;
  margin-left: 10px;
}
.generalViewContainer > div:first-child > div {
  float: right;
  line-height: 24px;
}
.generalViewContainer > div:first-child > div > span:first-child {
  font-size: 26px;
  font-weight: bold;
  color: rgba(0, 244, 246, 1);
}
.generalViewContainer > div:first-child > div > span:last-child {
  font-size: 14px;
  color: rgba(255, 255, 255, 1);
}
.recLight1 {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 2;
  width: 260px;
  transform: translateX(-50%);
}
.recLight2 {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
  width: 100%;
}
/* .mainDivider {
  margin: 7px 0;
  height: 4px;
  background-color: rgba(108, 147, 176, 0.4);
} */

.hewangStastic > div:first-child,
.shuiyuStastic > div:first-child,
.heichouStastic > div:first-child {
  margin: 20px 0 20px 0;
  height: 24px;
  width: 100%;
  line-height: 24px;
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
  font-weight: bold;
  position: relative;
}
.hewangStastic > div:first-child > span:last-child,
.shuiyuStastic > div:first-child > span:last-child,
.heichouStastic > div:first-child > span:last-child {
  height: 100%;
  width: 100%;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background-color: transparent;
  text-align: center;
}
.hewangStastic > div:first-child > span,
.shuiyuStastic > div:first-child > span,
.heichouStastic > div:first-child > span {
  height: 10px;
  width: 100%;
  border-left: 3px solid rgba(0, 244, 246, 0.8);
  border-right: 3px solid rgba(0, 244, 246, 0.8);
  background-color: rgba(4, 150, 255, 0.2);
  display: inline-block;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.hewangStastic > div:first-child > span > span,
.shuiyuStastic > div:first-child > span > span,
.heichouStastic > div:first-child > span > span {
  height: 10px;
  width: 70%;
  display: inline-block;
  margin: 0 auto;
  background-color: rgba(4, 150, 255, 0.4);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.hewangStastic > div:first-child > span > span > span,
.shuiyuStastic > div:first-child > span > span > span,
.heichouStastic > div:first-child > span > span > span {
  height: 10px;
  width: 69%;
  display: inline-block;
  margin: 0 auto;
  background-color: rgba(4, 150, 255, 0.4);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.hewangContent,
.shuiyuContent,
.heichouContent {
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.hewangContent > div,
.shuiyuContent > div,
.heichouContent > div {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    rgba(110, 140, 255, 0) 0%,
    rgba(64, 134, 254, 0.4) 100%
  );
  border-radius: 2px;
  margin-left: 8px;
  /* animation: backgroundFlash 2s linear infinite; */
  > span {
    text-align: center;
  }
}
@keyframes backgroundFlash {
  0% {
    background: none;
  }
  25% {
    background: linear-gradient(
      180deg,
      rgba(110, 140, 255, 0) 0%,
      rgba(64, 134, 254, 0.1) 100%
    );
  }
  50% {
    background: linear-gradient(
      180deg,
      rgba(110, 140, 255, 0) 0%,
      rgba(64, 134, 254, 0.2) 100%
    );
  }
  75% {
    background: linear-gradient(
      180deg,
      rgba(110, 140, 255, 0) 0%,
      rgba(64, 134, 254, 0.3) 100%
    );
  }
  100% {
    background: linear-gradient(
      180deg,
      rgba(110, 140, 255, 0) 0%,
      rgba(64, 134, 254, 0.4) 100%
    );
  }
}
.borderlt,
.borderrt {
  position: absolute;
  width: 4px;
  height: 4px;
}
.borderrt {
  right: 0;
}
.bottomLight {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.hewangContent > div:first-child > span:first-child {
  font-size: 26px;
  font-weight: bold;
  color: rgba(160, 136, 255, 1);
}
.heichouContent > div:first-child > span:first-child {
  font-size: 26px;
  font-weight: bold;
  color: rgba(155, 255, 5, 1);
}
.hewangContent > div:first-child > span:nth-child(3),
.shuiyuContent > div:last-child > span:nth-child(3) {
  line-height: 25px;
}
.hewangContent > div > span:nth-child(2),
.shuiyuContent > div > span:nth-child(2),
.heichouContent > div > span:nth-child(2) {
  font-size: 14px;
  color: rgba(255, 255, 255, 1);
}
.hewangContent > div > span:nth-child(3),
.shuiyuContent > div > span:nth-child(3),
.heichouContent > div > span:nth-child(3) {
  font-size: 12px;
  color: rgba(255, 255, 255, 1);
}
.hewangContent > div:last-child > span:first-child {
  font-size: 26px;
  font-weight: bold;
  color: rgba(3, 255, 173, 1);
}
.heichouContent > div:last-child > span:first-child {
  font-size: 26px;
  font-weight: bold;
  color: rgba(255, 123, 208, 1);
}
.shuiyuContent > div:first-child > span:first-child {
  font-size: 26px;
  font-weight: bold;
  color: rgba(255, 181, 76, 1);
}
.shuiyuContent > div:last-child > span:first-child {
  font-size: 26px;
  font-weight: bold;
  color: rgba(34, 165, 255, 1);
}
// @media screen and (max-height: 1070px) {
//   .resultTable > #charts {
//     height: 320px;
//   }
// }
.resultTable {
  width: 100%;
  height: calc(100% - 518px);
  // overflow: auto;
  // overflow-x: hidden;
}
#charts {
  width: 100%;
  height: 100%;
}
</style>
