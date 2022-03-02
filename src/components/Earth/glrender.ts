import * as THREE from "three";

import { BaseThree } from "@/utils/basethree";

import { Heatmap } from "@/components/Earth/heatmap";
import { FlyLine } from "@/components/Earth/flyline";
import { FeaturePoi } from "@/components/Earth/featurepoint";

let earth: THREE.Mesh<THREE.SphereGeometry, THREE.Material>,
  ambientLight: THREE.AmbientLight,
  hemisLight: THREE.HemisphereLight,
  baseThree: BaseThree,
  animateFrame: number,
  flyLine: FlyLine,
  heatmapMesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>,
  featurePoint: FeaturePoi,
  changeHeatmap: any;

const init = (domContainer: HTMLDivElement) => {
  baseThree = new BaseThree(domContainer);
  baseThree.camera.position.set(0, 0, 30);
  baseThree.orbitControl.minDistance = 22;
  baseThree.orbitControl.maxDistance = 42;

  ambientLight = new THREE.AmbientLight(0x555555);
  baseThree.scene.add(ambientLight);

  hemisLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
  hemisLight.position.copy(baseThree.camera.position);
  baseThree.scene.add(hemisLight);

  const geometry = new THREE.SphereGeometry(10, 32, 32);

  const earthPng = require("@/assets/earth/earth.jpg");
  const bumpPng = require("@/assets/earth/earth_bump.jpg");
  const specPng = require("@/assets/earth/earth_spec.jpg");

  const materia = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(earthPng),
    bumpMap: new THREE.TextureLoader().load(bumpPng),
    bumpScale: 0.15,
    specularMap: new THREE.TextureLoader().load(specPng),
    specular: new THREE.Color("#909090"),
    shininess: 5,
    transparent: true,
    color: 0xf7e7cf,
    // wireframe: true
  });

  earth = new THREE.Mesh(geometry, materia);
  baseThree.camera.lookAt(earth.position);

  baseThree.scene.add(earth);
};

const animate = () => {
  animateFrame = requestAnimationFrame(animate);
  hemisLight.position.copy(baseThree.camera.position);
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
  earth.children.forEach((item: any) => {
    item.geometry.dispose();
    item.material.dispose();
  });
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
