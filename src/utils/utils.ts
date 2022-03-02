import * as THREE from "three";

const checkStringIncludes = (target: string, input: string) => {
  if (target.includes(input)) return true;
  else return false;
};

const getParent = (object3D: THREE.Object3D, type: string, callback: any) => {
  let parent: THREE.Object3D | null = object3D;
  while (!callback(parent, type)) {
    parent = parent?.parent;
    if (parent === null) return null;
  }
  return parent;
};

const getChildren = (object3D: THREE.Object3D, type: string, callback: any) => {
  const children: THREE.Object3D[] = [];
  object3D.traverse((obj) => {
    children.push(obj);
  });
  let result;
  for (let i = 0; i < children.length; i++) {
    if (callback(children[i], type)) {
      result = children[i];
      break;
    }
  }
  return result !== undefined ? result : null;
};

export { checkStringIncludes, getParent, getChildren };
