import * as THREE from "three";

class BoxFrame {
  boxHelper: THREE.BoxHelper;
  constructor(color?: number) {
    const boxColor = color === undefined ? 0x00ffff : color;
    this.boxHelper = new THREE.BoxHelper(
      new THREE.Object3D(),
      new THREE.Color(boxColor)
    );

    // @ts-ignore
    this.boxHelper.material.depthTest = true;
  }

  addToScene(scene: THREE.Scene) {
    scene.add(this.boxHelper);
  }

  getBoxFrame(obj: THREE.Object3D) {
    this.boxHelper.setFromObject(obj);
    this.setVisible(true);
  }

  setVisible(res: boolean) {
    this.boxHelper.visible = res;
  }

  destroy() {
    const parent = this.boxHelper.parent;
    if (parent !== null) {
      parent.remove(this.boxHelper);
    }
  }
}

export { BoxFrame };
