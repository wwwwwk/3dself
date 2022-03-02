import { reactive, readonly } from "vue";

import { BaseThree } from "@/utils/basethree";

interface CurrentThree {
  scene: BaseThree | null;
}

const useCurrentSceneState = () => {
  const currentSceneState = reactive<CurrentThree>({
    scene: null,
  });

  const setCurrentSceneState = (three: BaseThree) => {
    currentSceneState.scene = three;
  };

  return { currentScene: (currentSceneState), setCurrentSceneState };
};

export { useCurrentSceneState };
