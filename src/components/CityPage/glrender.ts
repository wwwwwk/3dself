import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import { BaseThree } from "@/utils/basethree";
import { getPositionFromJson } from "@/utils/jsonmodel";
import {
  getHalfSphere,
  halfSphereDestroy,
} from "@/components/CityPage/halfsphere";
import {
  cylinderBuffer,
  distenceBufferDestroy,
} from "@/components/CityPage/distencebuffer";
import {
  setAreaMesh,
  geoDestroy,
  setStreet,
  setGreenLand,
} from "@/components/CityPage/addgeo";
import { setBuildingMesh, destroyBuilding } from "@/components/CityPage/addbuilding";
import { FeatureCylinder } from "@/components/CityPage/featurecylinder";
import { bloomLayerNum, initBloom, render } from "@/utils/setbloom";
import { setWater, destroyWater } from "@/components/CityPage/addwater";

let group: THREE.Object3D,
  ambientLight: THREE.AmbientLight,
  pointLight: THREE.PointLight,
  baseThree: BaseThree,
  featureCylinder: FeatureCylinder,
  composer: EffectComposer,
  animateFrame: number;

const init = (domContainer: HTMLDivElement) => {
  baseThree = new BaseThree(domContainer);
  baseThree.camera.position.set(0, -20, 30);
  baseThree.orbitControl.maxDistance = 60;
  baseThree.setCameraPosition();
  const skyImg = require("@/assets/city/sky.jpg");
  baseThree.scene.background = new THREE.TextureLoader().load(skyImg);

  group = new THREE.Object3D();
  baseThree.scene.add(group);

  ambientLight = new THREE.AmbientLight(0x404040);
  ambientLight.layers.enable(0);
  ambientLight.layers.enable(bloomLayerNum);
  baseThree.scene.add(ambientLight);
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.layers.enable(0);
  ambientLight.layers.enable(bloomLayerNum);
  baseThree.scene.add(pointLight);

  composer = initBloom(baseThree.scene, baseThree.camera, baseThree.renderer);

  addArea();
  addBuildingBM();
  addStreet();
  addHalfSphere();
  addDistanceBuffer();
  addCylinder();
  addWater();
  addGreenLand();
};

const animate = () => {
  animateFrame = requestAnimationFrame(animate);
  pointLight.position.copy(baseThree.camera.position);
  render(baseThree.scene, baseThree.camera, baseThree.renderer, composer);
  baseThree.orbitControl.update();
};

const addArea = () => {
  const target = require("@/assets/city/json/area.json");
  const result = getPositionFromJson(target);
  const mesh = setAreaMesh(result);
  baseThree.scene.add(mesh);
};
const addBuildingBM = () => {
  const target = require("@/assets/city/json/building.json");
  const result = getPositionFromJson(target, 0.5);
  // const bm = setBuildingBmMesh(result);
  const bm = setBuildingMesh(result);
  baseThree.scene.add(bm);
};

const addStreet = () => {
  const target = require("@/assets/city/json/street.json");
  const result = getPositionFromJson(target);
  // console.log(result);
  const mesh = setStreet(result);
  baseThree.scene.add(mesh);
};

const addGreenLand = () => {
  const target = require("@/assets/city/json/greenlandbj.json");
  const result = getPositionFromJson(target);
  const mesh = setGreenLand(result);
  baseThree.scene.add(mesh);
};

const addHalfSphere = () => {
  const mesh = getHalfSphere(baseThree.camera);
  baseThree.scene.add(mesh);
};

const addDistanceBuffer = () => {
  const mesh = cylinderBuffer({ x: 0, y: 0, z: 0 }, 3);
  baseThree.scene.add(mesh);
};

const addCylinder = () => {
  const data = [
    [2, 3],
    [10, 20],
    [-20, -30],
  ];
  featureCylinder = new FeatureCylinder(data);
  featureCylinder.setResult();
  baseThree.scene.add(featureCylinder.result);
  featureCylinder.moveAction({ time: 0.0 }, { time: 1.0 }, 2000);
};

const addWater = () => {
  const target = require("@/assets/city/json/water.json");
  const result = getPositionFromJson(target, 0.5);
  const water = setWater(result);
  baseThree.scene.add(water);
};

const destroy = () => {
  cancelAnimationFrame(animateFrame);
  pointLight.dispose();
  ambientLight.dispose();
  geoDestroy();
  halfSphereDestroy();
  distenceBufferDestroy();
  destroyWater();
  featureCylinder?.destroy();
  destroyBuilding();

  group.children.forEach((item: any) => {
    item.children.forEach((subItem: any) => {
      subItem.geometry.dispose();
      subItem.material.dispose();
    });
  });
  baseThree.destroy();
};

export { init, animate, destroy, baseThree };
