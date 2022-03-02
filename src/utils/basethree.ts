import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
  }

  get zoom() {
    return Math.round(
      this.orbitControl.target.distanceTo(this.orbitControl.object.position)
    );
  }

  destroy() {
    this.orbitControl.dispose();
    this.destroyRotate();
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
      this.requestAnimateId = requestAnimationFrame(action);
      this.scene.rotateY(0.004);
      this.scene.rotateZ(0.002);
    };
    action();
  }

  destroyRotate() {
    if (this.requestAnimateId) {
      cancelAnimationFrame(this.requestAnimateId);
    }
  }
}

export { BaseThree };
