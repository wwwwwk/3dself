<template>
  <div class="pipe-equipmentcontainer">
    <div>管网设施</div>
    <div class="pipe-intro">
      <div>
        <div>167.68</div>
        <div>普查区域面积</div>
        <div>(平方公里)</div>
      </div>
      <div>
        <div>1199.21</div>
        <div>管网里程</div>
        <div>(公里)</div>
      </div>
      <div>
        <div>7.15</div>
        <div>管网覆盖率</div>
        <div>(公里/平方公里)</div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="content-parent">
      <div class="pipe-content" ref="mainCont">
        <div class="pipe-content-first">
          <div>
            <div>
              <img :src="png1" />
              <div>
                <span>15</span>
                <span>泵站(个)</span>
              </div>
            </div>
            <div>
              <img :src="png2" />
              <div>
                <span>113</span>
                <span>化粪池(个)</span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <img :src="png3" />
              <div>
                <span>1091</span>
                <span>出水口(个)</span>
              </div>
            </div>
            <div>
              <img :src="png4" />
              <div>
                <span>8845</span>
                <span>检修井(个)</span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <img :src="png5" />
              <div>
                <span>17762</span>
                <span>雨篦(个)</span>
              </div>
            </div>
            <div>
              <img :src="png6" />
              <div>
                <span>3273</span>
                <span>雨水井(座)</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pipe-content-second">
          <div>
            <div>
              <img :src="png7" />
              <div>
                <span>84.45</span>
                <span>污水管线(公里)</span>
              </div>
            </div>
            <div>
              <img :src="png8" />
              <div>
                <span>841.1</span>
                <span>合流管线(公里)</span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <img :src="png9" />
              <div>
                <span>34</span>
                <span>闸门(个)</span>
              </div>
            </div>
            <div>
              <img :src="png10" />
              <div>
                <span>6115</span>
                <span>探测点(个)</span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <img :src="png11" />
              <div>
                <span>4</span>
                <span>闸门井(个)</span>
              </div>
            </div>
            <div>
              <img :src="png12" />
              <div>
                <span>273.67</span>
                <span>雨水管线(公里)</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pipe-content-third">
          <div>
            <div>
              <img :src="png1" />
              <div>
                <span>15</span>
                <span>泵站(个)</span>
              </div>
            </div>
            <div>
              <img :src="png2" />
              <div>
                <span>113</span>
                <span>化粪池(个)</span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <img :src="png3" />
              <div>
                <span>1091</span>
                <span>出水口(个)</span>
              </div>
            </div>
            <div>
              <img :src="png4" />
              <div>
                <span>8845</span>
                <span>检修井(个)</span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <img :src="png5" />
              <div>
                <span>17762</span>
                <span>雨篦(个)</span>
              </div>
            </div>
            <div>
              <img :src="png6" />
              <div>
                <span>3273</span>
                <span>雨水井(座)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        class="lunbo-point lunbo-active"
        ref="lunboPoint1"
        @click.prevent.stop="goto(0)"
      ></div>
      <div
        class="lunbo-point"
        ref="lunboPoint2"
        @click.prevent.stop="goto(1)"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted } from "vue";

const png1 = require("@/assets/city/png1.png");
const png2 = require("@/assets/city/png2.png");
const png3 = require("@/assets/city/png3.png");
const png4 = require("@/assets/city/png4.png");
const png5 = require("@/assets/city/png5.png");
const png6 = require("@/assets/city/png6.png");
const png7 = require("@/assets/city/png7.png");
const png8 = require("@/assets/city/png8.png");
const png9 = require("@/assets/city/png9.png");
const png10 = require("@/assets/city/png10.png");
const png11 = require("@/assets/city/png11.png");
const png12 = require("@/assets/city/png12.png");

let time = null;
let num = 0;
const domArray = [];

const lunboPoint1 = ref();
const lunboPoint2 = ref();
const mainCont = ref();

onBeforeUnmount(() => {
  if (time) {
    clearInterval(time);
    time = null;
  }
});
onMounted(()=>{
  domArray.push(lunboPoint1.value);
  domArray.push(lunboPoint2.value);
  init();
});

const init = () =>{
  time = setInterval(() => {
    if (num == 0) {
      lunboPoint2.value.classList.add("lunbo-active");
      lunboPoint1.value.classList.remove("lunbo-active");
    } else {
      lunboPoint2.value.classList.remove("lunbo-active");
      lunboPoint1.value.classList.add("lunbo-active");
    }
    nextMsg(1);
  }, 3000);
};

const nextMsg = (index:number) => {
  if (num == 1) {
    mainCont.value.classList.add("left-transition");
    let leftDistance = parseInt(mainCont.value.style.left);
    console.log(mainCont.value.style.width);
    console.log(mainCont.value.offsetWidth);
    const width = parseInt(mainCont.value.offsetWidth) / 3;
    console.log(width);
    if (!leftDistance) leftDistance = 0;
    mainCont.value.style.left = leftDistance - width * index + "px";
    mainCont.value.addEventListener(
      "webkitTransitionEnd",
      moveOrigin,
      false
    );
    return;
  }
  mainCont.value.removeEventListener(
    "webkitTransitionEnd",
    moveOrigin,
    false
  );
  mainCont.value.classList.add("left-transition");
  let leftDistance = parseInt(mainCont.value.style.left);
  const width = parseInt(mainCont.value.offsetWidth) / 3;
  if (!leftDistance) leftDistance = 0;
  mainCont.value.style.left = leftDistance - width * index + "px";
  num += index;
};

const moveOrigin = () => {
  num = 0;
  mainCont.value.classList.remove("left-transition");
  mainCont.value.style.left = 0;
};

const goto = (index:number) => {
  if (time) {
    clearInterval(time);
    time = null;
  }
  mainCont.value.removeEventListener(
    "webkitTransitionEnd",
    moveOrigin,
    false
  );
  mainCont.value.classList.add("left-transition");
  const width = parseInt(mainCont.value.offsetWidth) / 3;
  mainCont.value.style.left = -width * index + "px";
  for (let i = 0; i < domArray.length; i++) {
    if (i == index) domArray[i].className = "lunbo-point lunbo-active";
    else domArray[i].className = "lunbo-point";
  }
  num = index;
  init();
};
</script>
<style scoped>
.pipe-equipmentcontainer {
  width: 424px;
  height: 374px;
  background-color: rgba(0, 33, 81, 0.8);
  border-radius: 2px;
  position: absolute;
  top: 7px;
  left: 2px;
  padding: 13px 20px;
  overflow: hidden;
  box-sizing: border-box;
}
.pipe-equipmentcontainer > div:first-child {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 244, 246, 1);
  text-align: left;
  height: 22px;
  line-height: 22px;
}
.pipe-intro {
  width: 100%;
  height: 100px;
  display: flex;
}
.pipe-intro > div {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pipe-intro > div > div:first-child {
  font-size: 16px;
  color: rgba(0, 249, 187, 1);
  font-weight: bold;
  margin-bottom: 6px;
}
.pipe-intro > div > div:nth-child(2) {
  font-size: 16px;
  color: rgba(143, 198, 235, 1);
  margin-bottom: 6px;
}
.pipe-intro > div > div:last-child {
  font-size: 14px;
  color: rgba(143, 198, 235, 1);
}
.split-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(2, 137, 233, 0) 0%,
    rgba(2, 203, 233, 1) 50%,
    rgba(2, 137, 233, 0) 100%
  );
  margin: 0 0 10px 0;
}
.pipe-content {
  width: 300%;
  height: calc(100% - 128px);
  display: flex;
  position: relative;
  left: 0;
}
.pipe-content-first,
.pipe-content-second,
.pipe-content-third {
  position: relative;
  width: 100%;
  height: 100%;
  left: 0;
}
.left-transition {
  transition: left 0.7s ease-in;
}
.content-parent {
  width: 100%;
  overflow: hidden;
}
.pipe-content > div > div {
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10px;
}
.pipe-content > div > div > div {
  width: 186px;
  height: 56px;
  background-image: url("../../../assets/city/backgroundcolor.png");
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
.pipe-content > div > div > div > div {
  display: flex;
  align-items: center;
}
.pipe-content > div > div > div > div > span:first-child {
  font-size: 20px;
  color: rgba(4, 252, 173, 1);
  font-weight: bold;
  margin-right: 6px;
}
.pipe-content > div > div > div > div > span {
  font-size: 12px;
  color: rgba(143, 198, 235, 1);
}
.pipe-equipmentcontainer > div:last-child {
  position: absolute;
  bottom: 7px;
  left: 50%;
  width: 20px;
  height: 10px;
  display: flex;
  transform: translateX(-50%);
  justify-content: space-between;
  align-items: center;
}
.lunbo-point {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}
.lunbo-active {
  background-color: grey;
}
</style>
