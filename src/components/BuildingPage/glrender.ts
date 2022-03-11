import * as THREE from "three";

import { BaseThree } from "@/utils/basethree";
import { createVideoGeometry, destroyVideoGeometry } from "@/components/BuildingPage/videofusion";

let group: THREE.Object3D,
  ambientLight: THREE.AmbientLight,
  directionalLight1: THREE.DirectionalLight,
  directionalLight2: THREE.DirectionalLight,
  baseThree: BaseThree,
  animateFrame: number;

const init = (domContainer: HTMLDivElement) => {
  baseThree = new BaseThree(domContainer);

  baseThree.scene.background = new THREE.Color(0x8ccde);
  baseThree.camera.position.set(60, 25, -40);
  baseThree.setCameraPosition();

  directionalLight1 = new THREE.DirectionalLight(0xffeeff, 0.8);
  directionalLight1.position.set(1, 1, 1);
  baseThree.scene.add(directionalLight1);

  directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.25);
  directionalLight2.position.set(-1, 0.5, -1);
  baseThree.scene.add(directionalLight2);

  ambientLight = new THREE.AmbientLight(0xffffee, 0.25);
  baseThree.scene.add(ambientLight);

  group = new THREE.Object3D();
  baseThree.scene.add(group);

  addModel();
};

const addModel = async () => {
  const starImg = require("@/assets/city/star.jpg");
  const cubeMap = new THREE.CubeTextureLoader().load(
    new Array(6).fill(starImg)
  );
  const object = await baseThree.loadObj("model/city.mtl", "model/city.obj");
  object.traverse((child: any) => {
    if (child.isMesh) {
      child.material.envMap = cubeMap;
    }
  });
  
  group.add(object);
  group.position.set(-30, 0, -31);
  baseThree.camera.lookAt(group.position);
};

const animate = () => {
  animateFrame = requestAnimationFrame(animate);
  baseThree.renderer.render(baseThree.scene, baseThree.camera);
  baseThree.orbitControl.update();
};

const addVideo = async () => {
  const mesh = await createVideoGeometry();
  baseThree.scene.add(mesh);
};

const removeVideo = () => {
  destroyVideoGeometry(baseThree.scene);
};

const destroy = () => {
  cancelAnimationFrame(animateFrame);
  ambientLight.dispose();
  directionalLight1.dispose();
  directionalLight2.dispose();
  removeVideo();
  group.children.forEach((item: any) => {
    item.children.forEach((subItem: any) => {
      subItem.geometry.dispose();
      subItem.material.dispose();
    });
  });
  baseThree.destroy();
};

export { init, animate, destroy, addVideo, removeVideo, baseThree };
