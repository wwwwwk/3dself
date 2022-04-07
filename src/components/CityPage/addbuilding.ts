import * as THREE from "three";

const vs = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main()
  {
      vUv = uv;
      vPosition=position;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
  }
`;

const fs = `
  varying vec2 vUv;
  uniform sampler2D colorTexture;
  varying vec3 vPosition;
  void main() {
    vec2 position = vUv;
    vec4 colorb=texture2D(colorTexture,position.xy);

    gl_FragColor =colorb;
  }
`;

let buildingMesh: THREE.Mesh;

const initCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  const gradient = ctx!.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(0, 162, 255, 1)");
  gradient.addColorStop(0.2, "rgba(0, 162, 255, 0.4)");
  gradient.addColorStop(1, "rgba(0, 162, 255, 0)");
  ctx!.fillStyle = gradient;
  ctx!.fillRect(0, 0, 300, 300);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  // document.body.appendChild(canvas);
  return texture;
};

const setBuildingMesh = (result: any[]) => {
  const resultMesh = new THREE.Mesh();
  // console.log(texture);
  const texture = initCanvas();
  for (let i = 0; i < result.length; i += 1) {
    const shape = new THREE.Shape();
    shape.moveTo(result[i].position[0], result[i].position[1]);
    for (let j = 2; j < result[i].position.length; j += 2) {
      shape.lineTo(result[i].position[j], result[i].position[j + 1]);
    }
    const geometry = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: result[i].height,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1,
    });
    const material1 = new THREE.ShaderMaterial({
      uniforms: {
        colorTexture: {
          value: texture,
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const material2 = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, [material2, material1]);
    resultMesh.add(mesh);
  }

  buildingMesh = resultMesh;

  return resultMesh;
};

const destroyBuilding = () => {
  if (buildingMesh) {
    while (buildingMesh.children.length > 0) {
      (buildingMesh.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      buildingMesh.children[0].material[0].dispose();
      // @ts-ignore
      buildingMesh.children[0].material[1].dispose();
      buildingMesh.remove(buildingMesh.children[0]);
    }
    buildingMesh.geometry.dispose();
    // @ts-ignore
    buildingMesh.material.dispose();
  }
};

export { setBuildingMesh, destroyBuilding };
