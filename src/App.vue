<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
  <router-view></router-view>
</template>

<script lang="ts">
import { provide } from "vue";
import { useToolbarState } from "@/components/Layout/ToolBar/main";
import { useCurrentSceneState } from "@/components/Layout/ToolBar/reactattr";
import { usePopupShowState } from "@/components/Layout/Popup/popupatte";
export default {
  name: "App",
  setup() {
    const { toolbarState, setToolbarState } = useToolbarState();
    provide("toolbarState", toolbarState);
    provide("setToolbarState", setToolbarState);

    const { currentScene, setCurrentSceneState } = useCurrentSceneState();
    provide("currentScene", currentScene);
    provide("setCurrentSceneState", setCurrentSceneState);

    const { popupShow, setPopupShowState } = usePopupShowState();
    provide("popupShow", popupShow);
    provide("setPopupShowState", setPopupShowState);
  },
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #8fc6eb;
}
</style>
