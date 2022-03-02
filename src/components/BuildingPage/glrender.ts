import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { BaseThree } from "@/utils/basethree";

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

const animate = () => {
  animateFrame = requestAnimationFrame(animate);
  baseThree.renderer.render(baseThree.scene, baseThree.camera);
  baseThree.orbitControl.update();
};

const destroy = () => {
  cancelAnimationFrame(animateFrame);
  ambientLight.dispose();
  directionalLight1.dispose();
  directionalLight2.dispose();
  group.children.forEach((item: any) => {
    item.children.forEach((subItem: any) => {
      subItem.geometry.dispose();
      subItem.material.dispose();
    });
  });
  baseThree.destroy();
};

export { init, animate, destroy };
