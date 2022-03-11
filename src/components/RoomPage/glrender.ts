import * as THREE from "three";

import { BaseThree } from "@/utils/basethree";
import { BoxFrame } from "@/utils/boxframe";
import { SelectObj } from "@/utils/selectobj";
import { checkStringIncludes, getParent, getChildren } from "@/utils/utils";
import { throttle } from "@/utils/common";

let roomGltf: THREE.Group,
  ambientLight: THREE.AmbientLight,
  pointLight: THREE.HemisphereLight,
  baseThree: BaseThree,
  boxFrame: BoxFrame,
  serverFrame: BoxFrame,
  // domElement: HTMLDivElement,
  currentStatus: string,
  selectDoor: THREE.Object3D | null = null,
  selectServer: THREE.Object3D | null = null,
  animateFrame: number;

let setPopupShowState: any;

const allObj: Map<string, SelectObj> = new Map();

const init = async (domContainer: HTMLDivElement, tmp: any) => {
  setPopupShowState = tmp;

  // domElement = domContainer;
  baseThree = new BaseThree(domContainer);
  baseThree.camera.position.set(10, 10, 10);
  baseThree.setCameraPosition();
  const skyImg = require("@/assets/sky.webp");
  baseThree.scene.background = new THREE.TextureLoader().load(skyImg);

  ambientLight = new THREE.AmbientLight(0x404040);
  baseThree.scene.add(ambientLight);
  pointLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  baseThree.scene.add(pointLight);

  boxFrame = new BoxFrame();
  serverFrame = new BoxFrame(0xff0000);
  currentStatus = "rack";

  await addModel();

  addEvent(domContainer);
};

const animate = () => {
  animateFrame = requestAnimationFrame(animate);
  baseThree.renderer.render(baseThree.scene, baseThree.camera);
};

const addModel = async () => {
  const gltf = await baseThree.loadGltf("model/glb/jifang.glb");
  roomGltf = gltf.scene;
  baseThree.scene.add(roomGltf);
  baseThree.camera.lookAt(roomGltf.position);

  roomGltf.traverse((item) => {
    const objectWrap = new SelectObj(item);
    allObj.set(item.uuid, objectWrap);
  });

  boxFrame.addToScene(baseThree.scene);
  serverFrame.addToScene(baseThree.scene);
  // addEvent(domElement);
  // new GLTFLoader().setPath("model/glb/").load("jifang.glb", (gltf) => {
  //   roomGltf = gltf.scene;
  //   baseThree.scene.add(roomGltf);
  //   baseThree.camera.lookAt(roomGltf.position);

  //   // baseThree.scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1));

  //   roomGltf.traverse((item) => {
  //     const objectWrap = new SelectObj(item);
  //     allObj.set(item.uuid, objectWrap);
  //   });
  //   // console.log(allObj);

  //   boxFrame.addToScene(baseThree.scene);
  //   serverFrame.addToScene(baseThree.scene);
  //   addEvent(domElement);
  // });
};

const destroy = () => {
  cancelAnimationFrame(animateFrame);
  ambientLight.dispose();
  pointLight.dispose();
  baseThree.delChildren(roomGltf);
  baseThree.destroy();
};

const addEvent = (domContainer: HTMLDivElement) => {
  domContainer.addEventListener("mousedown", throttle(clickCallback, 1000));
  domContainer.addEventListener("mousemove", mousemoveCallback);
  domContainer.addEventListener("dblclick", throttle(dbclickCallback, 1500));
};

const removeEvent = (domContainer: HTMLDivElement) => {
  domContainer.removeEventListener("click", clickCallback);
  domContainer.removeEventListener("mousemove", mousemoveCallback);
  domContainer.removeEventListener("dblclick", dbclickCallback);
};

const checkStatus = (target: THREE.Object3D, type: string) => {
  return checkStringIncludes(target.name, type);
};

// const checkDoor = (target: THREE.Object3D) => {
//   return checkStringIncludes(target.name, "door");
// };

const clickCallback = (event: MouseEvent) => {
  event.preventDefault();
  clickServerCallback(event);
};

const mousemoveCallback = (event: MouseEvent) => {
  event.preventDefault();
  const result = baseThree.getIntersects(
    event.clientX,
    event.clientY,
    roomGltf
  );

  if (result.length > 0) {
    const target = getParent(result[0].object, currentStatus, checkStatus);
    if (target !== null) {
      boxFrame.getBoxFrame(target);
    } else {
      boxFrame.setVisible(false);
    }
  }
};

const dbclickCallback = (event: MouseEvent) => {
  event.preventDefault();

  if (selectDoor !== null) {
    dbclickRack(selectDoor, -90);
    currentStatus = "rack";
    selectDoor = null;
    return;
  }
  const result = baseThree.getIntersects(
    event.clientX,
    event.clientY,
    roomGltf
  );

  if (result.length > 0) {
    const target = getParent(result[0].object, "rack", checkStatus);
    // console.log(target);
    if (target === null) {
      currentStatus = "rack";
    } else {
      currentStatus = "server";
      selectDoor = target;
      dbclickRack(target, 90);
    }
  }
};

const getSelectTarget = (obj: THREE.Object3D) => {
  const result = allObj.get(obj.uuid);
  if (result === undefined) {
    return null;
  } else {
    return result;
  }
};

const dbclickRack = (obj: THREE.Object3D, angle: number) => {
  const rackObj = getSelectTarget(obj);
  if (rackObj !== null) {
    // selectDoor = rackObj;
    const door = getChildren(rackObj.object3D, "door", checkStatus);
    // console.log(door);
    if (door !== null) {
      const doorWarp = allObj.get(door.uuid);
      doorWarp?.move({
        name: "doorControl",
        rotation: {
          y: angle,
        },
      });
    }
  }
};

const clickServerCallback = (event: MouseEvent) => {
  setPopupShowState(false);
  const result = baseThree.getIntersects(
    event.clientX,
    event.clientY,
    roomGltf
  );

  if (selectServer !== null) {
    moveServer(selectServer, { x: -3, y: -3, z: -3 });
    selectServer = null;
    return;
  }

  if (result.length > 0) {
    const target = getChildren(result[0].object, "server", checkStatus);
    if (target !== null) {
      // serverFrame.getBoxFrame(target);
      moveServer(target, { x: 3, y: 3, z: 3 });
      selectServer = target;
      setPopupShowState(true);
    } else {
      // serverFrame.setVisible(false);
    }
  }
};

const moveServer = (obj: THREE.Object3D, position: object) => {
  const serverObj = getSelectTarget(obj);
  // console.log(serverObj);
  if (serverObj !== null) {
    const server = getChildren(serverObj.object3D, "server", checkStatus);
    // console.log(server);
    if (server !== null) {
      const serverWarp = allObj.get(server.uuid);
      serverWarp?.move({
        name: "serverControl",
        position: position,
      });
    }
  }
};

export { init, animate, destroy, removeEvent, baseThree };
