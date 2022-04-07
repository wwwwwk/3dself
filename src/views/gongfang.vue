<template>
  <div class="gongfang-main">
    <GongfangPage></GongfangPage>
  </div>
</template>
<script lang="ts">
import GongfangPage from "@/components/GongfangPage/index.vue";
import { inject } from "vue";

export default {
  name: "gongfang",
  components: { GongfangPage },
  setup() {
    const setToolbarState: any = inject("setToolbarState");
    setToolbarState({
      routeControl: true,
      rotateControl: true,
      initControl: true,
    });
  },
};
</script>
<style lang="less">
.gongfang-main {
  width: 100%;
  height: 100%;
}
</style>
