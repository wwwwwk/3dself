import * as THREE from "three";

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

const buildingColor = require("@/assets/city/buildingcolor2.png");
const buildingByte = require("@/assets/city/buildingbyte.png");
const texture = new THREE.TextureLoader().load(buildingColor);
const texture1 = new THREE.TextureLoader().load(buildingByte);

const setBuildingMesh = (shape: THREE.Shape, height: number) => {
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
        value: texture1
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

export { setBuildingMesh };
