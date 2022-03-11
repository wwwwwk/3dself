import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Easing, Tween } from "@tweenjs/tween.js";

interface BasicPosition {
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  orbitTarget: {
    x: number;
    y: number;
    z: number;
  };
}

class BaseThree {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  orbitControl: OrbitControls;
  camera: THREE.PerspectiveCamera;
  oldZoom: number;
  innerWidth: number;
  innerHeight: number;
  offset: DOMRect;
  rayCaster: THREE.Raycaster;
  mouseVector: THREE.Vector2;
  requestAnimateId: number;
  startPosition: BasicPosition;
  tweenMove: any;
  dom: HTMLDivElement;
  constructor(domContainer: HTMLDivElement) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(domContainer.offsetWidth, domContainer.offsetHeight);

    domContainer.appendChild(this.renderer.domElement);

    const aspect = domContainer.offsetWidth / domContainer.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    this.orbitControl = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.oldZoom = this.zoom;

    this.innerWidth = domContainer.offsetWidth;
    this.innerHeight = domContainer.offsetHeight;
    this.rayCaster = new THREE.Raycaster();
    this.offset = domContainer.getBoundingClientRect();
    this.mouseVector = new THREE.Vector2();

    this.requestAnimateId = 0;
    this.startPosition = {
      cameraPosition: { x: 0, y: 0, z: 0 },
      orbitTarget: { x: 0, y: 0, z: 0 },
    };

    this.dom = domContainer;

    this.eventOption(true);
  }

  setCameraPosition() {
    this.startPosition.cameraPosition = this.camera.position.clone();
  }

  eventOption(status: boolean) {
    const onWindowResize = () => {
      // this.camera.aspect = this.dom.offsetWidth / this.dom.offsetHeight;
      // this.camera.updateProjectionMatrix();

      // this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    if (status) window.addEventListener("resize", onWindowResize);
    else window.removeEventListener("resize", onWindowResize);
  }

  get zoom() {
    return Math.round(
      this.orbitControl.target.distanceTo(this.orbitControl.object.position)
    );
  }

  destroy() {
    this.orbitControl.dispose();
    this.destroyRotate();
    this.eventOption(false);
    if (this.requestAnimateId) {
      cancelAnimationFrame(this.requestAnimateId);
      this.requestAnimateId = 0;
    }
  }

  controlChange(callback: any) {
    this.orbitControl.addEventListener("change", callback);
  }

  changeZoom() {
    this.oldZoom = this.zoom;
  }

  removeChange(callback: any) {
    this.orbitControl.removeEventListener("change", callback);
  }

  delChildren(root: any) {
    if (Object.prototype.hasOwnProperty.call(root, "children")) {
      // console.log('递归删除');
      root.children.forEach((item: any) => {
        this.delChildren(item);
      });
    } else {
      if (Object.prototype.hasOwnProperty.call(root, "geometry")) {
        // console.log('删除mesh');
        root.geometry.dispose();
        root.material.dispose();
      } else {
        // console.log('删除mesh之外');
        root.dispose();
      }
    }
  }

  getIntersects(x: number, y: number, target: any): THREE.Intersection[] {
    const localX = ((x - this.offset.left) / this.innerWidth) * 2 - 1;
    const localY = (-(y - this.offset.top) / this.innerHeight) * 2 + 1;

    this.mouseVector.set(localX, localY);

    this.rayCaster.setFromCamera(this.mouseVector, this.camera);
    return this.rayCaster.intersectObject(target, true);
  }

  startRotate() {
    const action = () => {
      this.orbitControl.autoRotate = true;
      this.orbitControl.update();
    };
    action();
  }

  destroyRotate() {
    this.orbitControl.autoRotate = false;
  }

  loadGltf(fileStr: string): Promise<any> {
    const res = new Promise((resolve, reject) => {
      const gltfLoader = new GLTFLoader();
      const loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
      loader.setResponseType("arraybuffer");
      loader.load(fileStr, (data: any) => {
        const resourcePath = THREE.LoaderUtils.extractUrlBase(fileStr);
        gltfLoader.parse(
          data,
          resourcePath,
          (gltf: object) => {
            resolve(gltf);
          },
          (err: any) => {
            reject(err);
          }
        );
      });
    });

    return res;
  }

  loadObj(materialPath: string, objPath: string): Promise<any> {
    const res = new Promise((resolve, reject) => {
      const mtlLoader = new MTLLoader();
      const loader1 = new THREE.FileLoader(THREE.DefaultLoadingManager);
      loader1.setResponseType("text");
      loader1.load(materialPath, (data1: any) => {
        const resourcePath = THREE.LoaderUtils.extractUrlBase(materialPath);
        const material = mtlLoader.parse(data1, resourcePath);

        const objLoader = new OBJLoader();
        objLoader.setMaterials(material).load(
          objPath,
          (obj: any) => {
            resolve(obj);
          },
          undefined,
          (err: any) => {
            reject(err);
          }
        );
      });
    });

    return res;
  }

  movetoInit() {
    const oldCameraPos = this.camera.position.clone();
    const oldOrbitPos = this.orbitControl.target.clone();
    const oldMsg = {
      cameraPosition: oldCameraPos,
      orbitTarget: oldOrbitPos,
    };

    // console.log(oldMsg);
    // console.log(this.startPosition);

    this.moveAction(oldMsg, this.startPosition, 700);
  }

  moveAction(
    startLocation: BasicPosition,
    endLocation: BasicPosition,
    duration: number
  ) {
    this.tweenMove = new Tween(startLocation)
      .to(endLocation, duration)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        const cameraPosition = startLocation.cameraPosition;
        const orbitTarget = startLocation.orbitTarget;
        this.camera.position.set(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
        this.orbitControl.target.set(
          orbitTarget.x,
          orbitTarget.y,
          orbitTarget.z
        );
        this.orbitControl.update();
      })
      .onStop(() => {
        this.tweenMove = null;
      })
      .onComplete(() => {
        this.tweenMove = null;
      })
      .start();

    const animate = (time: number) => {
      if (this.tweenMove !== null) {
        this.requestAnimateId = requestAnimationFrame(animate);
        this.tweenMove.update(time);
      }
    };
    animate(0);
  }
}

export { BaseThree };
