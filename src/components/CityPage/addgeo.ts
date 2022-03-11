import * as THREE from "three";

import { Water } from "three/examples/jsm/objects/Water";

import { FlyLine } from "@/components/Earth/flyline";

const vs = `
  varying vec2 vUv;
  varying vec3 fNormal;
  varying vec3 vPosition;
  void main()
  {
      vUv = uv;
      fNormal=normal;
      vPosition=position;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
  }
`;

const fs = `
  uniform float time;
  varying vec2 vUv;
  uniform sampler2D colorTexture;
  uniform sampler2D colorTexture1;
  varying vec3 fNormal;
  varying vec3 vPosition;
  void main( void ) {
      vec2 position = vUv;
      vec3 tempNomal= normalize(fNormal);
      float power=step(1.2,abs(tempNomal.x));
      vec4 colorb=texture2D(colorTexture1,position.xy);
      vec4 colora = texture2D(colorTexture,vec2(vUv.x,fract(vUv.y-time))); 
      if(power>1.2){
          gl_FragColor =colorb;
      }else{
          gl_FragColor =colorb+colorb*colora;      
      }         
  }
`;

let buildingMesh: THREE.Mesh;
let areaMesh: THREE.Mesh;
let flyLine: FlyLine;
let streetMesh: THREE.Mesh;
let waterMesh: THREE.Mesh;
let greenLandMesh: THREE.Mesh;
let requestAnimationId: number;


// 废弃
const setBuildingMesh = (shape: THREE.Shape, height: number) => {
  const buildingColor = require("@/assets/city/buildingcolor2.png");
  const buildingByte = require("@/assets/city/buildingbyte.png");
  const texture = new THREE.TextureLoader().load(buildingColor);
  const texture1 = new THREE.TextureLoader().load(buildingByte);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: height,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1,
  });
  const materia = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0.3,
      },
      colorTexture: {
        value: texture,
      },
      colorTexture1: {
        value: texture1,
      },
    },
    vertexShader: vs,
    fragmentShader: fs,
    // blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false,
    // side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geometry, materia);
};

const setBuildingBmMesh = (result: any[]) => {
  const resultMesh = new THREE.Mesh();
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
    const tmpMateria = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x7d8ea5),
      metalness: 0,
      roughness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, tmpMateria);
    resultMesh.add(mesh);
  }

  buildingMesh = resultMesh;

  return resultMesh;
};

const setAreaMesh = (result: any[]) => {
  const resultMesh = new THREE.Mesh();
  const starImg = require("@/assets/city/star.jpg");
  const cubeMap = new THREE.CubeTextureLoader().load(
    new Array(6).fill(starImg)
  );
  // console.log(result);
  for (let i = 0; i < result.length; i += 1) {
    // const geometry = new THREE.BufferGeometry().setFromPoints(result[i].position);
    const shape = new THREE.Shape();
    shape.moveTo(result[i].position[0], result[i].position[1]);
    for (let j = 2; j < result[i].position.length; j += 2) {
      shape.lineTo(result[i].position[j], result[i].position[j + 1]);
    }
    const geometry = new THREE.ShapeGeometry(shape);
    const tmpMateria = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x000000),
      // envMap: cubeMap,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, tmpMateria);
    resultMesh.add(mesh);
  }

  areaMesh = resultMesh;

  return resultMesh;
};

const setStreet = (result: any[]) => {
  flyLine = new FlyLine(1, [], 2000);
  const resultMesh = new THREE.Mesh();
  const flyLineData = [];
  const colorData = [];
  for (let i = 0; i < result.length; i += 1) {
    const tmp = [];
    for (let j = 0; j < result[i].position.length; j += 2) {
      tmp.push(
        new THREE.Vector3(result[i].position[j], result[i].position[j + 1], 0)
      );
      colorData.push(
        new THREE.Vector3(Math.random(), Math.random(), Math.random())
      );
    }
    const curve = new THREE.CatmullRomCurve3(tmp);

    const points = curve.getPoints(2000);
    flyLineData.push(points);
  }
  flyLine.setParticles(flyLineData, colorData);
  for (let i = 0; i < flyLine.particles.length; i++) {
    resultMesh.add(flyLine.particles[i]);
  }
  flyLine.moveAction({ time: 0.0 }, { time: 0.6 }, 10000);

  streetMesh = resultMesh;

  return resultMesh;
};

const setGreenLand = (result: any[]) => {
  const resultMesh = new THREE.Mesh();
  const greenJpg = require("@/assets/city/green.jpg");
  const greenTexture = new THREE.TextureLoader().load(greenJpg);
  greenTexture.wrapS = THREE.RepeatWrapping;
  greenTexture.wrapT = THREE.RepeatWrapping;
  for (let i = 0; i < result.length; i += 1) {
    // const geometry = new THREE.BufferGeometry().setFromPoints(result[i].position);
    const shape = new THREE.Shape();
    shape.moveTo(result[i].position[0], result[i].position[1]);
    for (let j = 2; j < result[i].position.length; j += 2) {
      shape.lineTo(result[i].position[j], result[i].position[j + 1]);
    }
    const geometry = new THREE.ShapeGeometry(shape);
    const tmpMateria = new THREE.MeshBasicMaterial({
      map: greenTexture,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, tmpMateria);
    resultMesh.add(mesh);
  }

  greenLandMesh = resultMesh;

  return resultMesh;
};

const setWater = (result: any[]) => {
  const waterJpg = require("@/assets/city/water.jpg");
  const waterMapPng = require("@/assets/city/buildingcolor2.png");
  const resultMesh = new THREE.Mesh();
  for (let i = 0; i < result.length; i += 1) {
    const shape = new THREE.Shape();
    shape.moveTo(result[i].position[0], result[i].position[1]);
    for (let j = 2; j < result[i].position.length; j += 2) {
      shape.lineTo(result[i].position[j], result[i].position[j + 1]);
    }

    const geometry = new THREE.ShapeGeometry(shape);
    const waterMesh = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        waterJpg,
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      // fog: scene.fog !== undefined
    });
    resultMesh.add(waterMesh);
  }

  waterMesh = resultMesh;
  console.log(waterMesh);

  updateWater();

  return waterMesh;
};

const updateWater = () => {
  const updateAction = () => {
    // const time = performance.now() * 0.001;
    for (let i = 0; i < waterMesh.children.length; i++) {
      // @ts-ignore
      waterMesh.children[i].material.uniforms.time.value += 1.0 / 60;
    }
  };
  const animation = () => {
    requestAnimationId = requestAnimationFrame(animation);
    updateAction();
  };
  animation();
};

const geoDestroy = () => {
  if (areaMesh) {
    while (areaMesh.children.length > 0) {
      (areaMesh.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      (areaMesh.children[0] as THREE.Mesh).material.dispose();
      areaMesh.remove(areaMesh.children[0]);
    }
    areaMesh.geometry.dispose();
    // @ts-ignore
    areaMesh.material.dispose();
  }
  if (buildingMesh) {
    while (buildingMesh.children.length > 0) {
      (buildingMesh.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      (buildingMesh.children[0] as THREE.Mesh).material.dispose();
      buildingMesh.remove(buildingMesh.children[0]);
    }
    buildingMesh.geometry.dispose();
    // @ts-ignore
    buildingMesh.material.dispose();
  }
  if (streetMesh) {
    flyLine.destroy(streetMesh);
    while (streetMesh.children.length > 0) {
      (streetMesh.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      (streetMesh.children[0] as THREE.Mesh).material.dispose();
      streetMesh.remove(streetMesh.children[0]);
    }
    streetMesh.geometry.dispose();
    // @ts-ignore
    streetMesh.material.dispose();
  }
  if (waterMesh) {
    if (requestAnimationId) cancelAnimationFrame(requestAnimationId);
    while (waterMesh.children.length > 0) {
      (waterMesh.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      (waterMesh.children[0] as THREE.Mesh).material.dispose();
      waterMesh.remove(waterMesh.children[0]);
    }
    waterMesh.geometry.dispose();
    // @ts-ignore
    waterMesh.material.dispose();
  }
  if (greenLandMesh) {
    while (greenLandMesh.children.length > 0) {
      (greenLandMesh.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      (greenLandMesh.children[0] as THREE.Mesh).material.dispose();
      greenLandMesh.remove(greenLandMesh.children[0]);
    }
    greenLandMesh.geometry.dispose();
    // @ts-ignore
    greenLandMesh.material.dispose();
  }
};

export {
  setBuildingMesh,
  setBuildingBmMesh,
  setAreaMesh,
  geoDestroy,
  setStreet,
  setWater,
  setGreenLand,
};
