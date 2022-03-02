import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import { BaseThree } from "@/utils/basethree";

let finalComposer: EffectComposer,
  bloomPass: UnrealBloomPass,
  composer: EffectComposer,
  bloomLayer: THREE.Layers;

const bloomParams = {
  exposure: 1,
  bloomStrength: 1.9,
  bloomThreshold: 0.3,
  bloomRadius: 0.3,
  light: 0.1,
};

const BLOOM_SCENE = 9999;

const setBloom = (domContainer: HTMLDivElement, baseThree: BaseThree) => {
  const renderScene = new RenderPass(baseThree.scene, baseThree.camera);

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(domContainer.offsetWidth, domContainer.offsetHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.renderToScreen = true;
  bloomPass.threshold = bloomParams.bloomThreshold;
  bloomPass.strength = bloomParams.bloomStrength;
  bloomPass.radius = bloomParams.bloomRadius;

  composer = new EffectComposer(baseThree.renderer);
  composer.setSize(domContainer.offsetWidth, domContainer.offsetHeight);
  composer.addPass(renderScene);
  // composer.addPass(bloomPass);

  bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);

  const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

  const fragmentShader = `
      uniform sampler2D baseTexture;
      uniform sampler2D bloomTexture;
      varying vec2 vUv;
        void main() {
        gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
      }
    `;

  const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: composer.renderTarget2.texture },
        // bloomTexture: { value: null },
      },
      vertexShader,
      fragmentShader,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;

  finalComposer = new EffectComposer(baseThree.renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);
};

const materials: any = {};
const bloomIgnore: any = [];
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
function darkenNonBloomed(obj: any) {
  // if (obj instanceof THREE.Scene) { // 此处忽略Scene，否则场景背景会被影响
  //   materials.scene = obj.background;
  //   obj.background = null;
  //   return;
  // }
  if (
    // obj instanceof THREE.Sprite || // 此处忽略Sprite
    // bloomIgnore.includes(obj.type) ||
    obj.isMesh &&
    bloomLayer.test(obj.layers) === false // 判断与辉光是否同层
  ) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj: any) {
  // if (obj instanceof THREE.Scene) {
  //   obj.background = materials.scene;
  //   delete materials.scene;
  //   return;
  // }
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

export {
  BLOOM_SCENE,
  finalComposer,
  composer,
  setBloom,
  restoreMaterial,
  darkenNonBloomed,
  bloomPass,
};
