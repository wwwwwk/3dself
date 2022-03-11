import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

import { lonlatToSphere } from "@/utils/coord";

const fs = `
  varying float opacity;
  uniform vec3 color;
  void main(){
    if(opacity <= 0.1) {
      discard;
    } else {
      gl_FragColor = vec4(color, 1.0);
    }
  }
`;

const vs = `
  attribute float percent;
  uniform float time;
  uniform float number;
  uniform float speed;
  uniform float length;
  uniform float size;

  varying float opacity;

  void main() {
    float l = clamp(1.0 - length, 0.0, 1.0);

    gl_PointSize = clamp(fract(percent * number + l - time * number * speed) - l, 0.0, 1.0) * size * (1.0 / length);
    opacity = gl_PointSize / size;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

class FlyLine {
  count: number[];
  curves: THREE.CatmullRomCurve3[];
  mainDistance: number[];
  particles: THREE.Points[];
  radius: number;
  flyLine: any[];
  requestAnimationId: number;
  number: number;
  tweenMove: any;
  constructor(radius: number = 1, flyLine: any[] = [], number: number = 500) {
    this.radius = radius;
    this.count = [];
    this.curves = [];
    this.mainDistance = [];
    this.particles = [];
    this.flyLine = flyLine;
    this.number = number;
    this.requestAnimationId = 0;
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
      const distance = curve.getLength();
      this.mainDistance.push(distance);
      this.curves.push(curve);
      const points = curve.getPoints(this.number);

      result.push(points);
    }

    return result;
  }

  setParticles(
    inputPoints: THREE.Vector3[][],
    color = [new THREE.Vector3(1, 0, 0)]
  ) {
    let index = 0;
    inputPoints.forEach((points) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const length = points.length;
      const percents = new Float32Array(length);
      for (let i = 0; i < length; i += 1) {
        percents[i] = i / length;
      }
      geometry.setAttribute("percent", new THREE.BufferAttribute(percents, 1));

      const uniforms = {
        time: {
          value: 0.3,
        },
        number: {
          value: this.number,
        },
        speed: {
          value: 0.003,
        },
        length: {
          value: 0.1,
        },
        size: {
          value: 5.0,
        },
        color: {
          value: color[index],
        },
      };

      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
      });

      const particle = new THREE.Points(geometry, shaderMaterial);

      this.particles.push(particle);
      index++;
    });
  }

  createPointCanvas(size: number) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (context != null) {
      context.fillStyle = "rgba(255,255,255,.0)";
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
      context.closePath();
    }
    return canvas;
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
        this.requestAnimationId = requestAnimationFrame(animate);
        this.tweenMove.update(time);
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
