import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

import { lonlatToSphere } from "@/utils/coord";

const fs = `
  uniform vec3 color;
  uniform float time;
  varying float v_v;
  void main(){
    float w = 1.0 - pow(abs(v_v), 4.0);
    float alpha = pow(max(0.0, sin(3.14159 * (v_v + (1.0 - 2.0*time)))), 3.5);
    // if(alpha > 0.8) {
    //   gl_FragColor = vec4(color, 1.0);
    // } else {
    //   gl_FragColor = vec4(color, 0.4);
    // }

    gl_FragColor = vec4(color, alpha);
  }
`;
const vs = `
  attribute vec3 prev;
  attribute vec3 curr;
  attribute vec3 next;
  attribute float dirIndex;
  attribute float percent;
  uniform float lineWidth;
  varying float v_v;
  
  void main() {
    v_v = percent;
    if((prev == curr) || (next == curr)) {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(curr.x, curr.y + dirIndex * (lineWidth * 0.5), curr.z, 1.0);
    } else {
      vec3 prevDir = normalize(curr - prev);
      vec3 prevNor = normalize(vec3(-prevDir.y, prevDir.x, prevDir.z));
      vec3 nextDir = normalize(next - curr);
      vec3 nextNor = normalize(vec3(-nextDir.y, nextDir.x, nextDir.z));
  
      float angle = dot(prevNor, nextNor);
      float d = lineWidth * 0.5 / cos(angle * 0.5);

      vec2 tmp = vec2(-1.0, 0.0);
      vec2 cur = normalize(vec2(prevDir.y, prevDir.z));
      float tarAngle = dot(tmp, cur);
      float y = d * cos(tarAngle);
      float z = d * sin(tarAngle);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(curr.x + dirIndex * y, curr.y + dirIndex * z, curr.z, 1.0);
    }
  }
`;

class FlyLine {
  count: number[];
  curves: THREE.CatmullRomCurve3[];
  mainDistance: number[];
  particles: THREE.Mesh[];
  radius: number;
  flyLine: any[];
  requestAnimationId: number;
  number: number;
  tweenMove: any;
  lineWidth: number;
  constructor(radius: number = 1, flyLine: any[] = [], number: number = 500, lineWidth = 0.3) {
    this.radius = radius;
    this.count = [];
    this.curves = [];
    this.mainDistance = [];
    this.particles = [];
    this.flyLine = flyLine;
    this.number = number;
    this.requestAnimationId = 0;
    this.lineWidth = lineWidth;
  }

  // 废弃
  getData() {
    //请求数据
    const resData = [
      {
        from: [118.267, 37.345],
        to: [117.258, 38.134],
      },
      {
        from: [113.267, 35.345],
        to: [115.258, 36.134],
      },
    ];
  }

  getPoints() {
    const result: THREE.Vector3[][] = [];
    for (let i = 0; i < this.flyLine.length; i += 1) {
      this.count.push(0);
      const xyCoordFrom = lonlatToSphere(
        this.flyLine[i].from[0],
        this.flyLine[i].from[1],
        this.radius
      );
      const xyCoordTo = lonlatToSphere(
        this.flyLine[i].to[0],
        this.flyLine[i].to[1],
        this.radius
      );
      const xyCoordMid = lonlatToSphere(
        (this.flyLine[i].from[0] + this.flyLine[i].to[0]) / 2,
        (this.flyLine[i].from[1] + this.flyLine[i].to[1]) / 2,
        this.radius + 1
      );

      const fromPoint = new THREE.Vector3(
        xyCoordFrom.x,
        xyCoordFrom.y,
        xyCoordFrom.z
      );

      const midPoint = new THREE.Vector3(
        xyCoordMid.x,
        xyCoordMid.y,
        xyCoordMid.z
      );
      const toPoint = new THREE.Vector3(xyCoordTo.x, xyCoordTo.y, xyCoordTo.z);

      const curve = new THREE.CatmullRomCurve3([fromPoint, midPoint, toPoint]);
      const points = curve.getPoints(this.number);

      result.push(points);
    }

    return result;
  }

  setParticles(inputPoints: THREE.Vector3[][], colors: THREE.Color[]) {
    let index = 0;
    const result: THREE.Mesh[] = [];
    inputPoints.forEach((points) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const length = points.length;
      const percents = [];
      for (let i = 0; i < length; i += 1) {
        percents.push(i / length);
        percents.push(i / length);
      }
      const prev = [points[0].x, points[0].y, points[0].z, points[0].x, points[0].y, points[0].z];
      const curr = [];
      const next = [];
      const dirIndex = [];
      const verticsIndex = [];
      for (let i = 0; i < points.length; i++) {
        curr.push(points[i].x, points[i].y, points[i].z);
        curr.push(points[i].x, points[i].y, points[i].z);
        if (i > 0) {
          prev.push(points[i - 1].x, points[i - 1].y, points[i - 1].z);
          prev.push(points[i - 1].x, points[i - 1].y, points[i - 1].z);
          next.push(points[i].x, points[i].y, points[i].z);
          next.push(points[i].x, points[i].y, points[i].z);
        }
        dirIndex.push(1.0);
        dirIndex.push(-1.0);
      }
      next.push(points[0].x, points[0].y, points[0].z, points[0].x, points[0].y, points[0].z);
      for (let i = 0; i < dirIndex.length-2; i += 2) {
        verticsIndex.push(i);
        verticsIndex.push(i + 1);
        verticsIndex.push(i + 2);
        verticsIndex.push(i + 1);
        verticsIndex.push(i + 3);
        verticsIndex.push(i + 2);
      }
      geometry.setAttribute("percent", new THREE.BufferAttribute(new Float32Array(percents), 1));
      geometry.setAttribute("prev", new THREE.BufferAttribute(new Float32Array(prev), 3));
      geometry.setAttribute("curr", new THREE.BufferAttribute(new Float32Array(curr), 3));
      geometry.setAttribute("next", new THREE.BufferAttribute(new Float32Array(next), 3));
      geometry.setAttribute("dirIndex", new THREE.BufferAttribute(new Float32Array(dirIndex), 1));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(verticsIndex), 1));
      const material = new THREE.ShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: {
          color: {
            value: colors[index],
          },
          time: {
            value: 0.3,
          },
          lineWidth: {
            value: this.lineWidth
          }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false
      });
      // const material = new THREE.MeshBasicMaterial({color: 0xff0000});
      const mesh = new THREE.Mesh(geometry, material);

      result.push(mesh);
      index++;
    });
    this.particles = result;
  }

  updateParticles() {
    let time = 0;
    const updateAction = () => {
      for (let k = 0; k < this.particles.length; k += 1) {
        if (time >= 1.2) time = 0;
        time += 0.01;
        // @ts-ignore
        this.particles[k].material.uniforms.time.value = time;
      }
    };

    const animation = () => {
      this.requestAnimationId = requestAnimationFrame(animation);
      updateAction();
    };
    animation();
  }

  moveAction(startLocation: any, endLocation: any, duration: number) {
    const updateAction = (time: number) => {
      for (let k = 0; k < this.particles.length; k += 1) {
        // @ts-ignore
        this.particles[k].material.uniforms.time.value = time;
      }
    };
    this.tweenMove = new Tween(startLocation)
      .to(endLocation, duration)
      .easing(Easing.Linear.None)
      .onUpdate(() => {
        // if(startLocation.time >= 1.0) startLocation.time = 0.0;
        updateAction(startLocation.time);
      })
      .onStop(() => {
        this.tweenMove = null;
      })
      .onComplete(() => {
        this.tweenMove = null;
      })
      .repeat(Infinity)
      .start();

    const animate = (time: number) => {
      if (this.tweenMove !== null) {
        this.tweenMove.update(time);
        this.requestAnimationId = requestAnimationFrame(animate);
      }
    };
    animate(0);
  }

  addFromScene(scene: THREE.Mesh) {
    this.particles.forEach((item) => {
      // console.log(item);
      scene.add(item);
    });
  }

  destroy(scene: THREE.Mesh) {
    if (this.requestAnimationId) cancelAnimationFrame(this.requestAnimationId);
    for (let i = 0; i < this.particles.length; i++) {
      scene.remove(this.particles[i]);
      this.particles[i].geometry.dispose();
      // @ts-ignore
      this.particles[i].material.dispose();
    }
  }
}

export { FlyLine };
