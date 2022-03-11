import * as THREE from "three";

import { bloomLayerNum } from "@/utils/setbloom";

const vs = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fs = `
  uniform sampler2D mapIndex;
  uniform sampler2D lookup;
  uniform sampler2D outline;
  uniform sampler2D depthTexture;
  
  uniform vec3 surfaceColor;
  uniform vec3 lineColor;
  uniform vec3 oceanColor;
  uniform float flag;
  
  varying vec2 vUv;
  
  void main() {
    vec4 mapColor = texture2D(mapIndex, vUv);
    float indexedColor = mapColor.x;
    vec4 lookupColor = texture2D(lookup, vec2(indexedColor, 0.0));
    float outlineColor = texture2D(outline, vUv).x;
    vec4 depth = texture2D(depthTexture, vUv);
    vec4 earthColor = vec4(0.0);

    if (lookupColor.x == 1.0) {
      if (outlineColor > 0.2) {
        earthColor = vec4(lineColor, 0.6);
      } else {
        earthColor = vec4(mix(surfaceColor, vec3(indexedColor), 0.0), 1.0);
      }
    } else if (lookupColor.x == 0.0) {
      if(depth.x > 0.4) {
        earthColor = vec4(mix(surfaceColor, depth.xyz, 0.1), 1.0);
      } else {
        earthColor = vec4(mix(surfaceColor, depth.xyz, 0.3), 1.0);
      }
    }

    gl_FragColor = earthColor;
  }
`;

const vs1 = `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fs1 = `
  uniform float c;
  uniform float p;
  uniform vec3 color;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 0.7)), p);
    gl_FragColor = vec4(color, 1.0) * intensity;
  }
`;

const setEarthSphere = () => {
  // texture1
  const mpaIndexPng = require("@/assets/earth/earthindex.png");
  const mapIndex = new THREE.TextureLoader().load(mpaIndexPng);
  // texture2
  const lookupCanvas = document.createElement("canvas");
  lookupCanvas.width = 256;
  lookupCanvas.height = 1;

  const context = lookupCanvas.getContext("2d");
  context!.fillStyle = "#000000";
  context!.fillRect(0, 0, 1, 1);
  context!.fillStyle = "#ffffff";
  context!.fillRect(2, 0, 256, 1);

  const lookupTexture = new THREE.Texture(lookupCanvas);
  lookupTexture.magFilter = THREE.NearestFilter;
  lookupTexture.minFilter = THREE.NearestFilter;
  lookupTexture.needsUpdate = true;
  // console.log(lookupTexture);
  // texture3
  const mapOutlinePng = require("@/assets/earth/earthoutline.png");
  const mapOutline = new THREE.TextureLoader().load(mapOutlinePng);

  // console.log(render1);

  const earthDepthPng = require("@/assets/earth/earthdepth.png");
  const depthTexture = new THREE.TextureLoader().load(earthDepthPng);

  const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
  const earthMaterual = new THREE.ShaderMaterial({
    vertexShader: vs,
    fragmentShader: fs,
    uniforms: {
      mapIndex: { value: mapIndex },
      lookup: { value: lookupTexture },
      outline: { value: mapOutline },
      depthTexture: { value: depthTexture },
      surfaceColor: { value: new THREE.Color(9 / 255, 22 / 255, 39 / 255) },
      lineColor: { value: new THREE.Color(86 / 255, 117 / 255, 146 / 255) },
      oceanColor: { value: new THREE.Color(8 / 255, 16 / 255, 29 / 255) },
    },
  });

  const earthLight = new THREE.SphereGeometry(10.5, 32, 32);

  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: vs1,
    fragmentShader: fs1,
    uniforms: {
      c: {
        value: 0.3,
      },
      p: {
        value: 0.85,
      },
      color: {
        value: new THREE.Color(42 / 255, 68 / 255, 119 / 255),
      },
    },
    side: THREE.BackSide,
  });

  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterual);
  earthMesh.layers.set(0);

  const earthLightMesh = new THREE.Mesh(earthLight, earthMaterial);
  earthLightMesh.layers.set(bloomLayerNum);

  return { earthMesh, earthLightMesh };
};

export { setEarthSphere };
