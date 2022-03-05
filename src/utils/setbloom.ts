import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

const bloomLayerNum = 9999;
const params = {
  bloomStrength: 1.2,
  bloomThreshold: 0.1,
  bloomRadius: 0.55,
};

const initBloom = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    3,
    0.85,
    0.1
  );
  bloomPass.renderToScreen = true;
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  const composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  return composer;
};

const render = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  composer: EffectComposer | null = null
) => {
  if (composer) {
    renderer.autoClear = false;

    renderer.clear();
    camera.layers.set(bloomLayerNum);
    composer?.render();
  }

  renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);
};

export { bloomLayerNum, initBloom, render };
