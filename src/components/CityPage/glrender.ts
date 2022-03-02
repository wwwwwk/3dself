import * as THREE from "three";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { BaseThree } from "@/utils/basethree";
import { getPositionFromJson } from "@/utils/jsonmodel";
import {
  getHalfSphere,
  halfSphereDestroy,
} from "@/components/CityPage/halfsphere";
import {
  getDistanceBuffer,
  cylinderBuffer,
  distenceBufferDestroy,
} from "@/components/CityPage/distencebuffer";
import {
  setBuildingBmMesh,
  setAreaMesh,
  geoDestroy,
  setStreet,
  setGreenLand
} from "@/components/CityPage/addgeo";
import { FeatureCylinder } from "@/components/CityPage/featurecylinder";
import {
  BLOOM_SCENE,
  finalComposer,
  composer,
  setBloom,
  restoreMaterial,
  darkenNonBloomed,
  bloomPass,
} from "@/components/CityPage/addbloom";
import {setWater, destroyWater} from "@/components/CityPage/addwater";

let group: THREE.Object3D,
  ambientLight: THREE.AmbientLight,
  pointLight: THREE.PointLight,
  baseThree: BaseThree,
  featureCylinder: FeatureCylinder,
  animateFrame: number;

const init = (domContainer: HTMLDivElement) => {
  baseThree = new BaseThree(domContainer);
  baseThree.camera.position.set(0, -20, 30);
  baseThree.orbitControl.maxDistance = 60;
  const skyImg = require("@/assets/city/sky.jpg");
  baseThree.scene.background = new THREE.TextureLoader().load(skyImg);

  group = new THREE.Object3D();
  baseThree.scene.add(group);

  ambientLight = new THREE.AmbientLight(0x404040);
  baseThree.scene.add(ambientLight);
  pointLight = new THREE.PointLight(0xffffff, 1);
  baseThree.scene.add(pointLight);

  setBloom(domContainer, baseThree);

  // addModel();
  addArea();
  addBuildingBM();
  addStreet();
  addHalfSphere();
  addDistanceBuffer();
  addCylinder();
  addWater();
  addGreenLand();

  // console.log(baseThree.scene);
};

const animate = () => {
  animateFrame = requestAnimationFrame(animate);
  composer.render();
  // baseThree.scene.traverse(darkenNonBloomed); // 隐藏不需要辉光的物体
  // composer.render();
  // baseThree.scene.traverse(restoreMaterial); // 还原
  // finalComposer.render();
  pointLight.position.copy(baseThree.camera.position);
  baseThree.orbitControl.update();
};

const addModel = () => {
  const starImg = require("@/assets/city/star.jpg");
  const cubeMap = new THREE.CubeTextureLoader().load(
    new Array(6).fill(starImg)
  );
  // cubeMap.encoding = THREE.RGBM16Encoding;
  new MTLLoader().setPath("model/").load("city.mtl", (materials) => {
    materials.preload();
    new OBJLoader()
      .setMaterials(materials)
      .setPath("model/")
      .load("city.obj", (object) => {
        // console.log(object);
        object.traverse((child: any) => {
          if (child.isMesh) {
            child.material.envMap = cubeMap;
            // child.material.needsUpdate = true;
          }
        });

        group.add(object);
        // console.log(group);
        group.position.set(-30, 0, -31);
        baseThree.camera.lookAt(group.position);
      });
  });
};

const addArea = () => {
  const target = require("@/assets/city/json/area.json");
  // console.log(target);
  const result = getPositionFromJson(target);
  // console.log(result);
  const mesh = setAreaMesh(result);
  baseThree.scene.add(mesh);
};
const addBuildingBM = () => {
  const target = require("@/assets/city/json/building.json");
  const result = getPositionFromJson(target, 0.5);
  const bm = setBuildingBmMesh(result);
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
  // console.log(mesh);
  baseThree.scene.add(mesh);
};

const addDistanceBuffer = () => {
  // const mesh = getDistanceBuffer({ x: 0, y: 0, z: 0 }, 3);
  // mesh.layers.enable(BLOOM_SCENE);
  
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
  // console.log(featureCylinder.cylinder);
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
  bloomPass.dispose();
  geoDestroy();
  halfSphereDestroy();
  distenceBufferDestroy();
  destroyWater();
  featureCylinder?.destroy();

  group.children.forEach((item: any) => {
    item.children.forEach((subItem: any) => {
      subItem.geometry.dispose();
      subItem.material.dispose();
    });
  });
  baseThree.destroy();
};

export { init, animate, destroy, baseThree };
