import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

import { bloomLayerNum } from "@/utils/setbloom";
import { FlyLine } from "@/components/Earth/line";

const vs = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fs = `
  uniform sampler2D sphereTexture;
  uniform vec3 spherePos1[10];
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float ring;
  void main() {
    vec4 finalColor = vec4(-1.0, -1.0, -1.0, -1.0);
    for(int i=0; i<10; i++) {
      if(spherePos1[i].x == -1.0 && spherePos1[i].y == -1.0 && spherePos1[i].z == -1.0) {
        vec4 color = vec4(texture2D(sphereTexture, vUv));
        finalColor = vec4(color.xyz, 0.2);
      } else {
        float dis = distance(vPosition, spherePos1[i]);
        if(dis > ring && dis < (2.0)) {
          gl_FragColor = vec4(0.0,1.0,0.0, 0.3);
          return;
        } else {
          vec4 color = vec4(texture2D(sphereTexture, vUv));
          finalColor = vec4(color.xyz, 0.2);
        }
      }
    }
    if(vUv.y < 0.03)
      gl_FragColor = finalColor;
    else 
      gl_FragColor = vec4(finalColor.xyz, 0.08);
  }
`;

interface TimeAction {
  time: number;
}

let attackHandle: number,
  bigMask: THREE.Mesh,
  flyLine: FlyLine,
  tweenMove: any,
  requestAnimationId: number;

const setBigMask = () => {
  const geometry = new THREE.SphereGeometry(
    50,
    36,
    36,
    0,
    Math.PI * 2,
    0,
    (Math.PI / 180) * 90
  );

  const canvas = setTexture();

  const texture = new THREE.CanvasTexture(canvas);
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;
  const material = new THREE.ShaderMaterial({
    vertexShader: vs,
    fragmentShader: fs,
    uniforms: {
      sphereTexture: {
        value: texture,
      },
      spherePos1: {
        // @ts-ignore
        type: "fv",
        value: new Array(30).fill(-1),
      },
      ring: {
        value: 0.1,
      },
    },
    transparent: true,
    side: THREE.DoubleSide,
  });
  // console.log(material);

  bigMask = new THREE.Mesh(geometry, material);
  bigMask.position.set(0, 0, 0);
  bigMask.layers.enable(bloomLayerNum);

  return bigMask;
};

const setTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const gl = canvas.getContext("2d");
  const lingrad = gl!.createLinearGradient(0, 0, 0, 128);
  lingrad.addColorStop(0, "#FFF");
  lingrad.addColorStop(0.98, "rgba(3,12,255,0.2)");
  lingrad.addColorStop(1, "rgba(3,1,136,1)");

  gl!.fillStyle = lingrad;
  gl!.fillRect(0, 0, 128, 128);

  // document.body.append(canvas);
  return canvas;
};

const startAttack = (scene: THREE.Mesh) => {
  if (attackHandle) clearInterval(attackHandle);
  attackHandle = setInterval(() => {
    createLine(scene);
  }, 3000);
};

const createLine = (scene: THREE.Mesh) => {
  removeLine(scene);

  const result = [];
  const lines = [];
  const colorData = [];
  flyLine = new FlyLine(undefined, undefined, undefined, 1.0);
  for (let i = 0; i < 10; i++) {
    const tmp = getIntersect();
    // console.log(tmp);
    result.push(tmp.end.x);
    result.push(tmp.end.y);
    result.push(tmp.end.z);
    const lineData = [tmp.start, tmp.end];
    lines.push(lineData);
    colorData.push(new THREE.Color(1, 0, 1));
  }
  flyLine.setParticles(lines, colorData);
  for (let i = 0; i < flyLine.particles.length; i++) {
    scene.add(flyLine.particles[i]);
  }
  flyLine.moveAction({ time: 0.0 }, { time: 1.0 }, 800);

  updateMaterial(result);
  moveAction({ time: 0 }, { time: 1.0 }, 1500);
};

const removeLine = (scene: THREE.Mesh) => {
  // @ts-ignore
  bigMask.material.uniforms.spherePos1.value = new Array(30).fill(-1);
  if (flyLine) flyLine.destroy(scene);
};

const updateMaterial = (target: number[]) => {
  // @ts-ignore
  bigMask.material.uniforms.spherePos1.value = target;
};

const getIntersect = () => {
  const point1 = new THREE.Vector3(
    Math.floor(Math.random() * (50 - -50 + 1)) + -50 + 30,
    Math.floor(Math.random() * (50 - 0 + 1)) + 0 + 50,
    Math.floor(Math.random() * (50 - -50 + 1)) + -50 + 30
  );
  const point2 = new THREE.Vector3(
    Math.floor(Math.random() * (20 - -20 + 1)) + -20,
    Math.floor(Math.random() * (20 - 0 + 1)) + 0,
    Math.floor(Math.random() * (20 - -20 + 1)) + -20
  );
  const vec = point2.sub(point1).normalize();
  const ray = new THREE.Ray(point1, vec);
  const intersectPoint = new THREE.Vector3();
  ray.intersectSphere(
    new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50),
    intersectPoint
  );
  return { start: point1, end: intersectPoint };
};

const moveAction = (
  startLocation: TimeAction,
  endLocation: TimeAction,
  duration: number
) => {
  const updateAction = (time: number) => {
    // @ts-ignore
    bigMask.material.uniforms.ring.value = time;
  };
  tweenMove = new Tween(startLocation)
    .to(endLocation, duration)
    .easing(Easing.Linear.None)
    .onUpdate(() => {
      updateAction(startLocation.time);
    })
    .onStop(() => {
      tweenMove = null;
    })
    .onComplete(() => {
      tweenMove = null;
    })
    .repeat(Infinity)
    .start();

  const animate = (time: number) => {
    if (tweenMove !== null) {
      tweenMove.update(time);
      requestAnimationId = requestAnimationFrame(animate);
    }
  };
  animate(0);
};

const bigMaskdestroy = (scene: THREE.Mesh) => {
  if (requestAnimationId) cancelAnimationFrame(requestAnimationId);
  if (attackHandle) clearInterval(attackHandle);
  if (flyLine) flyLine.destroy(scene);
  scene.remove(bigMask);
  bigMask.geometry.dispose();
  // @ts-ignore
  bigMask.material.dispose();
};

export { startAttack, bigMaskdestroy, setBigMask };
