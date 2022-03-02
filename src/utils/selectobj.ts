import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

import { angleToRad } from "@/utils/coord";

interface MoveInfo {
  name: string;
  duration?: number;
  position?: {
    x?: number;
    y?: number;
    z?: number;
  };
  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };
}

interface LocationInfo {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

class SelectObj {
  object3D: THREE.Object3D;
  uuid: string;
  // @ts-ignore
  fullName: string;
  tweenMove: any;
  tweenBranch: any;
  // @ts-ignore
  requestAnimateId: number;

  constructor(object3D: THREE.Object3D) {
    this.object3D = object3D;
    this.uuid = object3D.uuid;

    this.setFullName();
  }

  setFullName(): void {
    const list = [];
    let obj: THREE.Object3D | null = this.object3D;
    while (obj !== undefined && obj !== null) {
      list.unshift(obj.name);
      obj = obj.parent;
    }
    this.fullName = list.join("/");
  }
  move(moveInfo: MoveInfo) {
    const oldPosition = this.object3D.position.clone();
    const oldRotation = this.object3D.rotation.clone();
    const oldLocation = {
      position: oldPosition,
      rotation: oldRotation,
    };
    const endPositionX =
      moveInfo.position?.x === undefined
        ? oldPosition.x
        : oldPosition.x + moveInfo.position.x;
    const endPositionY =
      moveInfo.position?.y === undefined
        ? oldPosition.y
        : oldPosition.y + moveInfo.position.y;
    const endPositionZ =
      moveInfo.position?.z === undefined
        ? oldPosition.z
        : oldPosition.z + moveInfo.position.z;

    const endRotationX =
      moveInfo.rotation?.x === undefined
        ? oldRotation.x
        : oldRotation.x + angleToRad(moveInfo.rotation.x);
    const endRotationY =
      moveInfo.rotation?.y === undefined
        ? oldRotation.y
        : oldRotation.y + angleToRad(moveInfo.rotation.y);
    const endRotationZ =
      moveInfo.rotation?.z === undefined
        ? oldRotation.z
        : oldRotation.z + angleToRad(moveInfo.rotation.z);

    const endPosition = new THREE.Vector3(
      endPositionX,
      endPositionY,
      endPositionZ
    );
    const endRotation = new THREE.Euler(
      endRotationX,
      endRotationY,
      endRotationZ
    );
    const endLocation = {
      position: endPosition,
      rotation: endRotation,
    };
    const startLocation = {
      position: oldLocation.position.clone(),
      rotation: oldLocation.rotation.clone(),
    };
    const duration = moveInfo.duration === undefined ? 1000 : moveInfo.duration;

    this.moveAction(startLocation, endLocation, duration);
  }

  moveAction(
    startLocation: LocationInfo,
    endLocation: LocationInfo,
    duration: number
  ) {
    this.tweenMove = new Tween(startLocation)
      .to(endLocation, duration)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        const position = startLocation.position;
        const rotation = startLocation.rotation;
        this.object3D.position.set(position.x, position.y, position.z);
        this.object3D.rotation.set(rotation.x, rotation.y, rotation.z);
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

  destroy() {
    if (this.requestAnimateId) {
      cancelAnimationFrame(this.requestAnimateId);
    }
  }
}

export { SelectObj };
