<template>
  <div class="home-container">
    <router-link
      v-for="(value, index) in headerData"
      :key="index"
      :to="value.path"
    >
      <span>{{ value.name }}</span>
    </router-link>
  </div>

  <div class="gl-render" ref="homeContainer"></div>
</template>
<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { init, animate, destroy } from "./glrender";
export default {
  name: "HomePage",
  setup() {
    const headerData = [
      {
        name: "地球",
        path: "/earth",
      },
      {
        name: "城市",
        path: "/city",
      },
      {
        name: "攻防",
        path: "/gongfang",
      },
      {
        name: "建筑",
        path: "/building",
      },
      {
        name: "房间",
        path: "/room",
      },
    ];

    const homeContainer = ref();

    onMounted(() => {
      init(homeContainer.value);
      animate();
    });

    onBeforeUnmount(() => {
      destroy();
    });

    return { homeContainer, headerData };
  },
};
</script>
<style lang="less" scoped>
.gl-render {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
}
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  > a {
    width: 18%;
    height: 45%;
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
    border: 1px solid rgba(127, 255, 255, 0.25);
    background-color: rgba(0, 127, 127, 0.16);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    transition: width 1s;
    > span {
      font-size: 60px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.75);
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
    }
  }
  > a:hover {
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.75);
    border: 1px solid rgba(127, 255, 255, 0.75);
    text-decoration: none;
  }
}
.element {
  position: absolute;
  width: 120px;
  height: 160px;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  text-align: center;
  line-height: normal;
  cursor: pointer;
  .number {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(127, 255, 255, 0.75);
  }
  .symbol {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    font-size: 60px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
  }
}
.element:hover {
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}
</style>
