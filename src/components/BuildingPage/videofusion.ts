import * as THREE from "three";

const points = [
  -0.03 +3.4537427754660115,  0.1+0,                      -0.12+5.806787451032328,
  -0.03 +3.042526546627741,   0.1+0,                      -0.12+5.6288199787680355,
  -0.03 +3.272292720956692,   0.1+0,                      -0.13+5.226959578084006,
  -0.03 +3.229305449496451,   0.1+0.9070675854191911,     -0.03+5.096755104413255,
  -0.03 +1.2487418168323003,  0.1+0.9085150060252899,     -0.03+3.94582722729713,
  -0.03 +1.2580911767120924,  0.1+0,                      -0.07+3.9512602458285144,
  -0.03 +0.889333485323963,   0.1+0,                      -0.12+4.481996121659876,
  -0.03 +0.1591810011586361,  0.1+0,                      -0.12+3.938042762149202,

  -0.03 +0.20987074112279203, 0.1+0,                      -0.12+3.9280313000949434,
  -0.03 +1.761385908402147,   0.1+0,                      -0.12+1.4237831841023265,
  -0.03 +2.1902376070468605,  0.1+0,                      -0.12+1.7346784815499845,
  -0.03 +4.340211453258945,   0.1+0,                      -0.12+3.0924952718128225,
  -0.03 +4.668736334966788,   0.1+0,                      -0.12+3.221557615488372,
  -0.03 +3.567078882077446,   0.1+0,                      -0.12+5.531804172151787
];

const targetIndex = [
  0, 2, 1,
  2, 4, 3,
  4, 2, 5,
  5, 7, 6,
  7, 5, 8,
  8, 5, 9,
  9, 5, 10,
  10, 5, 2,
  10, 2, 11,
  13, 11, 2,
  11,13, 12,
  2, 0, 13,
];

const uv = [
  1, 1,
  0.85,1,
  0.75, 0.6,
  0.85,1,
  0.3,1,
  0.3, 0.6,
  0.6, 1,
  0, 1,
  0, 0.6,
  0, 0,
  0.3, 0,
  0.75, 0,
  1, 0,
  1, 0.6
];

let mesh: THREE.Mesh;

const createVideoGeometry = async () => {
  const geometry = new THREE.BufferGeometry();

  const vertices = new Float32Array(points);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    
  const verticesUv = new Float32Array(uv);
  geometry.setAttribute("uv", new THREE.BufferAttribute(verticesUv, 2));

  const verticesIndex = new Uint32Array(targetIndex);
  geometry.setIndex(new THREE.BufferAttribute(verticesIndex, 1));

  const videoDiv: HTMLVideoElement = (document.getElementById("videoDiv")) as HTMLVideoElement;
  const texture = new THREE.VideoTexture(videoDiv);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.format = THREE.RGBAFormat;
  
  videoDiv.load();
  await videoDiv.play();

  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  material.needsUpdate = true;

  mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

const destroyVideoGeometry = (scene: THREE.Scene) => {
  if(mesh) {
    mesh.geometry.dispose();
    // @ts-ignore
    mesh.material.dispose();

    scene.remove(mesh);
  }
};

export { createVideoGeometry, destroyVideoGeometry };

