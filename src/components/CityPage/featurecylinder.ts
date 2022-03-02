import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

const vs = `
  varying vec2 vUv;
  
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4( position, 1.0 );
  }
`;

const fs = `
  uniform float time;
  varying vec2 vUv;
  uniform sampler2D dtPyramidTexture;
  uniform vec3 uColor;
  void main() {
    vec2 st = vUv;
    vec4 colorImage = texture2D(dtPyramidTexture, vec2(vUv.x,fract(vUv.y-time)));
    //float alpha=mix(0.1,1.0,clamp((1.0-vUv.y) * uColor.a,0.0,1.0)) +(1.0-sign(vUv.y-time*0.001))*0.2*(1.0-colorImage.r);
    vec3 diffuse =(1.0-colorImage.a)*vec3(0.8,1.0,0.0)+colorImage.rgb*vec3(0.8,1.0,0);
    gl_FragColor = vec4(diffuse,0.7);
  }
`;

const png = require("@/assets/city/guangzhaojianbianbai.png");
const pngTexture = new THREE.TextureLoader().load(png);

class FeatureCylinder {
  result: THREE.Mesh;
  position: number[][];
  requestAnimationId: number;
  tweenMove: any;
  cylinder: THREE.Mesh[];
  translate: number;
  angle: number;
  constructor(position: number[][]) {
    this.position = position;
    this.result = new THREE.Mesh();
    this.requestAnimationId = 0;
    this.tweenMove = null;
    this.cylinder = [];
    this.translate = 1;
    this.angle = 0;
  }

  setResult() {
    for (let i = 0; i < this.position.length; i += 1) {
      const mesh = this.setFeatureCylinder(
        this.position[i][0],
        this.position[i][1],
        3
      );
      this.result.add(mesh);
      this.cylinder.push(mesh);
    }
  }

  setFeatureCylinder(x: number, y: number, z: number) {
    const geometry = new THREE.CylinderBufferGeometry(
      0,
      0.6,
      1,
      4,
      1,
      false,
      0,
      6.3
    );
    const material = new THREE.ShaderMaterial({
      uniforms: {
        dtPyramidTexture: {
          value: pngTexture,
        },
        time: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color("#5588aa"),
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotateX(-Math.PI / 2);

    return mesh;
  }

  moveAction(startLocation: any, endLocation: any, duration: number) {
    const updateAction = (time: number) => {
      for (let k = 0; k < this.cylinder.length; k += 1) {
        // @ts-ignore
        this.cylinder[k].material.uniforms.time.value = time;
        this.angle += 0.01;
        this.cylinder[k].geometry.rotateY(0.06);
        this.translate = Math.sin(this.angle) > 0 ? 0.01 : -0.01;
        this.cylinder[k].geometry.translate(
          0,
          this.translate,
          0
        );
      }
    };
    this.tweenMove = new Tween(startLocation)
      .to(endLocation, duration)
      .easing(Easing.Linear.None)
      .onUpdate(() => {
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

  destroy() {
    if(this.requestAnimationId) cancelAnimationFrame(this.requestAnimationId);
    while (this.result.children.length > 0) {
      (this.result.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      (this.result.children[0] as THREE.Mesh).material.dispose();
      this.result.remove(this.result.children[0]);
    }
    this.result.geometry.dispose();
    // @ts-ignore
    this.result.material.dispose();
  }
}

export { FeatureCylinder };
