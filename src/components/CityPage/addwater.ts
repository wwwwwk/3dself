import * as THREE from "three";

const vs = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fs = `
  uniform vec3 u_color;
  uniform sampler2D backgroundTexture;
  varying vec2 vUv;
  uniform float offsetX;
  uniform float offsetY;

  void main() {
    gl_FragColor = texture2D(backgroundTexture, vec2(vUv.x + offsetX, vUv.y + offsetY));
  }
`;

let waterMesh: THREE.Mesh;
let requestAnimationId: number;

const setWater = (result: any[]) => {
  const waterJpg = require("@/assets/city/water.jpg");
  const waterNormalTexture = new THREE.TextureLoader().load(waterJpg);
  waterNormalTexture.wrapS = THREE.RepeatWrapping;
  waterNormalTexture.wrapT = THREE.RepeatWrapping;
  const resultMesh = new THREE.Mesh();
  for (let i = 0; i < result.length; i += 1) {
    const shape = new THREE.Shape();
    shape.moveTo(result[i].position[0], result[i].position[1]);
    for (let j = 2; j < result[i].position.length; j += 2) {
      shape.lineTo(result[i].position[j], result[i].position[j + 1]);
    }

    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        offsetX: { value: 0.1 },
        backgroundTexture: { value: waterNormalTexture },
        u_color: { value: new THREE.Color(1, 1, 1) },
        offsetY: { value: 0.3 },
      },
      vertexShader: vs,
      fragmentShader: fs,
      // depthTest: false,
    });
    const waterMesh = new THREE.Mesh(geometry, material);
    resultMesh.add(waterMesh);
  }

  waterMesh = resultMesh;
  console.log(waterMesh);

  updateWater();

  return waterMesh;
};

const updateWater = () => {
  let offsetX = 0.0;
  let offsetY = 0.0;
  const updateAction = () => {
    // const time = performance.now() * 0.001;
    for (let i = 0; i < waterMesh.children.length; i++) {
      if (offsetX > 1) offsetX = 0;
      offsetX += 0.001;
      if (offsetY > 1) offsetY = 0;
      // @ts-ignore
      waterMesh.children[i].material.uniforms.offsetX.value = offsetX;
      // @ts-ignore
      waterMesh.children[i].material.uniforms.offsetY.value = offsetX;
    }
  };
  const animation = () => {
    requestAnimationId = requestAnimationFrame(animation);
    updateAction();
  };
  animation();
};

const destroyWater = () => {
  if (waterMesh) {
    if (requestAnimationId) cancelAnimationFrame(requestAnimationId);
    while (waterMesh.children.length > 0) {
      (waterMesh.children[0] as THREE.Mesh).geometry.dispose();
      //   @ts-ignore
      waterMesh.children[0].material.dispose();
      waterMesh.remove(waterMesh.children[0]);
    }
    waterMesh.geometry.dispose();
    // @ts-ignore
    waterMesh.material.dispose();
  }
};

export { setWater, destroyWater };
