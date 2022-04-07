import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { BaseThree } from "@/utils/basethree";
import { bloomLayerNum, initBloom, render } from "@/utils/setbloom";
import {
  startAttack,
  bigMaskdestroy,
  setBigMask,
} from "@/components/GongfangPage/bigmask";
import {
  setSmallMask,
  smallMaskdestroy,
  startSmallAttack,
} from "@/components/GongfangPage/smallmask";

let gongfang: THREE.Mesh,
  ambientLight: THREE.AmbientLight,
  hemisLight: THREE.HemisphereLight,
  baseThree: BaseThree,
  composer: EffectComposer,
  animateFrame: number;

const init = (domContainer: HTMLDivElement) => {
  baseThree = new BaseThree(domContainer);
  baseThree.camera.position.set(-10, 100, 120);
  baseThree.setCameraPosition();

  ambientLight = new THREE.AmbientLight(0x404040);
  ambientLight.layers.enable(bloomLayerNum);
  ambientLight.layers.enable(0);
  baseThree.scene.add(ambientLight);

  hemisLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
  hemisLight.position.set(0, 0, 10);
  hemisLight.layers.enable(bloomLayerNum);
  hemisLight.layers.enable(0);
  baseThree.scene.add(hemisLight);

  composer = initBloom(baseThree.scene, baseThree.camera, baseThree.renderer);

  gongfang = new THREE.Mesh();
  baseThree.scene.add(gongfang);

  addSmallMask(gongfang);
  addBigMask(gongfang);
};

const animate = () => {
  render(baseThree.scene, baseThree.camera, baseThree.renderer, composer);
  baseThree.orbitControl.update();
  animateFrame = requestAnimationFrame(animate);
};

const addBigMask = (mesh: THREE.Mesh) => {
  const bigMask = setBigMask();
  mesh.add(bigMask);
  startAttack(bigMask);
};

const addSmallMask = (mesh: THREE.Mesh) => {
  const smallMask = setSmallMask();
  mesh.add(smallMask);
  startSmallAttack(smallMask);
};

const destroy = () => {
  cancelAnimationFrame(animateFrame);
  ambientLight.dispose();
  hemisLight.dispose();
  bigMaskdestroy(gongfang);
  smallMaskdestroy(gongfang);
  baseThree.destroy();
};

export { init, animate, destroy, baseThree };
