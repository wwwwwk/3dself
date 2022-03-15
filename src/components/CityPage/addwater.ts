import * as THREE from "three";

const vs = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fs = `
  precision highp float;

  uniform float time;
  uniform vec2 resolution;
  uniform sampler2D backgroundTexture;

  void main() {
    vec2 cPos = 2.0 * gl_FragCoord.xy / resolution.xy;
    float cLength = length(cPos);

    vec2 uv = gl_FragCoord.xy / resolution.xy + (cPos / cLength) * cos(cLength * 12.0 - time * 4.0) * 0.03;
    vec3 color = texture2D(backgroundTexture, uv).xyz;

    gl_FragColor = vec4(color, 1.0);
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
        backgroundTexture: { value: waterNormalTexture },
        time: { value: -1 },
        resolution: { value: new THREE.Vector2(225, 225) },
      },
      vertexShader: vs,
      fragmentShader: fs,
      // depthTest: false,
    });
    const waterMesh = new THREE.Mesh(geometry, material);
    resultMesh.add(waterMesh);
  }

  waterMesh = resultMesh;
  // console.log(waterMesh);

  updateWater();

  return waterMesh;
};

const updateWater = () => {
  let time = -1;
  const updateAction = () => {
    for (let i = 0; i < waterMesh.children.length; i++) {
      time += 0.004;
      // @ts-ignore
      waterMesh.children[i].material.uniforms.time.value = time;
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
