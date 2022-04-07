import * as THREE from "three";

import { bloomLayerNum } from "@/utils/setbloom";
import { FlyLine } from "@/components/Earth/line";

const sphereVs = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sphereFs = `
  uniform sampler2D sphereTexture;
  uniform vec3 pointPos[3];
  uniform float ring;
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vec3 color = vec4(texture2D(sphereTexture, vUv)).xyz;
    vec4 finalColor = vec4(-1.0, -1.0, -1.0, -1.0);
    for(int i=0; i<3; i++) {
      if(pointPos[i].x == -1.0 && pointPos[i].y == -1.0 && pointPos[i].z == -1.0) {
        finalColor = vec4(color, 0.2);
      } else {
        float dis = distance(vPosition, pointPos[i]);
        if(dis < ring) {
          float a = 1.0 - dis / ring * 0.6;
          gl_FragColor = vec4(color, a);
          return;
        } else {
          finalColor = vec4(color, 0.2);
        }
      }
    }
    gl_FragColor = finalColor;
  }
`;

let smallMask: THREE.Mesh, attackHandle: number, flyLine: FlyLine;

const setSmallMask = () => {
  const geometry = new THREE.SphereGeometry(
    25,
    36,
    36,
    0,
    Math.PI * 2,
    0,
    (Math.PI / 180) * 90
  );

  const png = require("@/assets/city/water.jpg")
  const texture = new THREE.TextureLoader().load(png);
  const material = new THREE.ShaderMaterial({
    vertexShader: sphereVs,
    fragmentShader: sphereFs,
    uniforms: {
      sphereTexture: {
        value: texture,
      },
      pointPos: {
        // @ts-ignore
        type: "fv",
        value: new Array(9).fill(-1),
      },
      ring: {
        value: 3.0,
      },
    },
    transparent: true,
    side: THREE.DoubleSide,
  });

  smallMask = new THREE.Mesh(geometry, material);
  smallMask.position.set(0, 0, 0);
  smallMask.layers.enable(0);

  return smallMask;
};

const createLine = (scene: THREE.Mesh) => {
  removeLine(scene);

  const result = [];
  const lines = [];
  const colorData = [];
  for (let i = 0; i < 3; i++) {
    const tmp = getIntersect();
    // console.log(tmp);
    result.push(tmp.end.x);
    result.push(tmp.end.y);
    result.push(tmp.end.z);
    const lineData = [tmp.start, tmp.end];
    lines.push(lineData);
    colorData.push(new THREE.Color(0, 1, 1));
  }
  flyLine = new FlyLine(undefined, undefined, undefined, 0.8);
  flyLine.setParticles(lines, colorData);
  for (let i = 0; i < flyLine.particles.length; i++) {
    scene.add(flyLine.particles[i]);
  }
  flyLine.moveAction({ time: 0.0 }, { time: 1.0 }, 1200);
  updateMaterial(result);
};

const updateMaterial = (target: number[]) => {
  // @ts-ignore
  smallMask.material.uniforms.pointPos.value = target;
};

const getIntersect = () => {
  const point1 = new THREE.Vector3(
    Math.floor(Math.random() * (50 - -50 + 1)) + -50 + 30,
    Math.floor(Math.random() * (50 - 0 + 1)) + 0 + 50,
    Math.floor(Math.random() * (50 - -50 + 1)) + -50 + 30
  );
  const point2 = new THREE.Vector3(
    Math.floor(Math.random() * (10 - -10 + 1)) + -10,
    Math.floor(Math.random() * (10 - 0 + 1)) + 0,
    Math.floor(Math.random() * (10 - -10 + 1)) + -10
  );
  const vec = point2.sub(point1).normalize();
  const ray = new THREE.Ray(point1, vec);
  const intersectPoint = new THREE.Vector3();
  ray.intersectSphere(
    new THREE.Sphere(new THREE.Vector3(0, 0, 0), 25),
    intersectPoint
  );
  return { start: point1, end: intersectPoint };
};

const removeLine = (scene: THREE.Mesh) => {
  // @ts-ignore
  smallMask.material.uniforms.pointPos.value = new Array(9).fill(-1);
  if (flyLine) flyLine.destroy(scene);
};

const startSmallAttack = (scene: THREE.Mesh) => {
  attackHandle = setInterval(() => {
    createLine(scene);
  }, 3000);
};

const smallMaskdestroy = (scene: THREE.Mesh) => {
  if (attackHandle) clearInterval(attackHandle);
  if (flyLine) flyLine.destroy(scene);
  scene.remove(smallMask);
  smallMask.geometry.dispose();
  // @ts-ignore
  smallMask.material.dispose();
};

export { setSmallMask, smallMaskdestroy, startSmallAttack };
