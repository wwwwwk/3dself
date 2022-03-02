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
<script>
export default {
  name: "PipeEquipment",
  data() {
    return {
      time: null,
      num: 0,
      domArray: [],
      png1: require("@/assets/city/png1.png"),
      png2: require("@/assets/city/png2.png"),
      png3: require("@/assets/city/png3.png"),
      png4: require("@/assets/city/png4.png"),
      png5: require("@/assets/city/png5.png"),
      png6: require("@/assets/city/png6.png"),
      png7: require("@/assets/city/png7.png"),
      png8: require("@/assets/city/png8.png"),
      png9: require("@/assets/city/png9.png"),
      png10: require("@/assets/city/png10.png"),
      png11: require("@/assets/city/png11.png"),
      png12: require("@/assets/city/png12.png"),
    };
  },
  beforeUnmount() {
    if (this.time) {
      clearInterval(this.time);
      this.time = null;
    }
  },
  mounted() {
    this.domArray.push(this.$refs.lunboPoint1);
    this.domArray.push(this.$refs.lunboPoint2);
    this.init();
  },
  methods: {
    init() {
      this.time = setInterval(() => {
        if (this.num == 0) {
          this.$refs.lunboPoint2.classList.add("lunbo-active");
          this.$refs.lunboPoint1.classList.remove("lunbo-active");
        } else {
          this.$refs.lunboPoint2.classList.remove("lunbo-active");
          this.$refs.lunboPoint1.classList.add("lunbo-active");
        }
        this.nextMsg(1);
      }, 3000);
    },
    nextMsg(index) {
      if (this.num == 1) {
        this.$refs.mainCont.classList.add("left-transition");
        let leftDistance = parseInt(this.$refs.mainCont.style.left);
        if (!leftDistance) leftDistance = 0;
        this.$refs.mainCont.style.left = leftDistance - 384 * index + "px";
        // this.num += index;
        this.$refs.mainCont.addEventListener(
          "webkitTransitionEnd",
          this.moveOrigin,
          false
        );
        return;
      }
      this.$refs.mainCont.removeEventListener(
        "webkitTransitionEnd",
        this.moveOrigin,
        false
      );
      this.$refs.mainCont.classList.add("left-transition");
      let leftDistance = parseInt(this.$refs.mainCont.style.left);
      if (!leftDistance) leftDistance = 0;
      this.$refs.mainCont.style.left = leftDistance - 384 * index + "px";
      this.num += index;
    },
    moveOrigin() {
      this.num = 0;
      this.$refs.mainCont.classList.remove("left-transition");
      this.$refs.mainCont.style.left = 0;
    },
    goto(index) {
      if (this.time) {
        clearInterval(this.time);
        this.time = null;
      }
      this.$refs.mainCont.removeEventListener(
        "webkitTransitionEnd",
        this.moveOrigin,
        false
      );
      this.$refs.mainCont.classList.add("left-transition");
      this.$refs.mainCont.style.left = -384 * index + "px";
      for (let i = 0; i < this.domArray.length; i++) {
        if (i == index) this.domArray[i].className = "lunbo-point lunbo-active";
        else this.domArray[i].className = "lunbo-point";
      }
      console.log(this.$refs.mainCont.style.left);
      this.num = index;
      this.init();
    },
  },
};
</script>
<style scoped>
.pipe-equipmentcontainer {
  width: 424px;
  height: 356px;
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
