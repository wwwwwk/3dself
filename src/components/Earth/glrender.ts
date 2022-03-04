import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import { BaseThree } from "@/utils/basethree";
import { bloomLayerNum, initBloom } from "@/utils/setbloom";
import { setEarthSphere } from "@/components/Earth/earthsphere";

import { Heatmap } from "@/components/Earth/heatmap";
import { FlyLine } from "@/components/Earth/flyline";
import { FeaturePoi } from "@/components/Earth/featurepoint";

let earth: THREE.Mesh<THREE.SphereGeometry, THREE.Material>,
  earthLight: THREE.Mesh,
  ambientLight: THREE.AmbientLight,
  hemisLight: THREE.HemisphereLight,
  baseThree: BaseThree,
  animateFrame: number,
  flyLine: FlyLine,
  heatmapMesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>,
  featurePoint: FeaturePoi,
  composer: EffectComposer,
  changeHeatmap: any;

const init = (domContainer: HTMLDivElement) => {
  baseThree = new BaseThree(domContainer);
  baseThree.camera.position.set(0, 0, 30);
  baseThree.orbitControl.minDistance = 22;
  baseThree.orbitControl.maxDistance = 42;

  ambientLight = new THREE.AmbientLight(0x555555);
  ambientLight.layers.enable(0);
  ambientLight.layers.enable(bloomLayerNum);
  baseThree.scene.add(ambientLight);

  hemisLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
  hemisLight.layers.enable(0);
  hemisLight.layers.enable(bloomLayerNum);
  hemisLight.position.copy(baseThree.camera.position);
  baseThree.scene.add(hemisLight);

  composer = initBloom(baseThree.scene, baseThree.camera, baseThree.renderer);

  const { earthMesh, earthLightMesh } = setEarthSphere();

  earth = earthMesh;
  earthLight = earthLightMesh;

  baseThree.scene.add(earthMesh);
  baseThree.scene.add(earthLightMesh);
};

const animate = () => {
  animateFrame = requestAnimationFrame(animate);
  hemisLight.position.copy(baseThree.camera.position);
  baseThree.renderer.autoClear = false;

  baseThree.renderer.clear();
  baseThree.camera.layers.set(bloomLayerNum);
  composer.render();

  baseThree.renderer.clearDepth();
  baseThree.camera.layers.set(0);
  baseThree.renderer.render(baseThree.scene, baseThree.camera);
  baseThree.orbitControl.update();
};

const openHeatmap = async () => {
  const config = {
    radius: 20,
    gradient: {
      0.2: "rgba(0,0,255,0.2)",
      0.3: "rgba(43,111,231,0.3)",
      0.4: "rgba(2,192,241,0.4)",
      0.6: "rgba(44,222,148,0.6)",
      0.8: "rgba(254,237,83,0.8)",
      0.9: "rgba(255,118,50,0.9)",
      1: "rgba(255,64,28,1)",
    },
  };

  const heatmap = new Heatmap(config);
  await heatmap.setHeatmap();

  const heatmapMateria = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(heatmap.canvas),
    transparent: true,
    depthTest: false,
  });
  heatmapMesh = new THREE.Mesh(earth.geometry, heatmapMateria);
  earth.add(heatmapMesh);

  changeHeatmap = async () => {
    const zoom = baseThree.zoom;
    const oldZoom = baseThree.oldZoom;
    if (oldZoom !== zoom) {
      const radius = ((zoom - 42) / (22 - 42)) * (5 - 20) + 20;
      await heatmap.refresh(radius);

      const tempMateria = new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(heatmap.canvas),
        transparent: true,
        depthTest: false,
      });

      heatmapMesh.material = tempMateria;
      heatmapMateria.dispose();
      baseThree.changeZoom();
    }
  };

  baseThree.controlChange(changeHeatmap);
};

const closeHeatmap = () => {
  if (heatmapMesh) {
    earth.remove(heatmapMesh);
    heatmapMesh.geometry.dispose();
    heatmapMesh.material.dispose();
    baseThree.removeChange(changeHeatmap);
  }
};

const openFlyline = async () => {
  // 获取数据
  const resData = [
    {
      from: [128.267, 17.345],
      to: [117.258, 38.134],
    },
    {
      from: [133.267, 35.345],
      to: [115.258, 26.134],
    },
  ];
  const color = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, 0)];

  flyLine = new FlyLine(10, resData, 500);
  const points = flyLine.getPoints();

  flyLine.setParticles(points, color);

  flyLine.addFromScene(earth);

  // flyLine.updateParticles();
  flyLine.moveAction({ time: 0.0 }, { time: 0.66 }, 1000);
};

const closeFlyline = () => {
  if (flyLine) {
    flyLine.destroy(earth);
  }
};

const openFeaturePoint = async () => {
  featurePoint = new FeaturePoi(earth);
  const res = await featurePoint.getDatas();
  // console.log(res);
  featurePoint.setPoints(res.data.features, 10, earth);
};

const closeFeaturePoint = () => {
  if (featurePoint) {
    featurePoint.destroy(earth);
  }
};

const destroy = () => {
  cancelAnimationFrame(animateFrame);
  hemisLight.dispose();
  ambientLight.dispose();
  closeFlyline();
  closeHeatmap();
  closeFeaturePoint();
  earth.geometry.dispose();
  earth.material.dispose();
  earthLight.geometry.dispose();
  // @ts-ignore
  earthLight.material.dispose();
  while (earth.children.length > 0) {
    (earth.children[0] as THREE.Mesh).geometry.dispose();
    // @ts-ignore
    (areaMesh.children[0] as THREE.Mesh).material.dispose();
    earth.remove(earth.children[0]);
  }
  baseThree.destroy();
};

export {
  init,
  animate,
  destroy,
  openHeatmap,
  closeHeatmap,
  openFlyline,
  closeFlyline,
  openFeaturePoint,
  closeFeaturePoint,
  baseThree,
};
