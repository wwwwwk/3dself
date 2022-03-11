import * as THREE from "three";

const vs = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fs = `
varying vec3 vPosition;
		uniform vec3 u_color;
		uniform float u_r;
		uniform float u_ring;

		void main(){
			float pct=distance(vec2(vPosition.x,vPosition.y),vec2(0.0));
			if(pct>u_r || pct<(u_r-u_ring)){
				gl_FragColor = vec4(0.0,1.0,0.0,0);
			}else{
				// float dis=(pct-(u_r-u_ring))/(u_r-u_ring);
				gl_FragColor = vec4(u_color,1.0);
			}
		}
`;

let requestAnimationId: number;
let distenceBufferMesh: THREE.Mesh;
let requestAnimationId2: number;
let cylinderMesh: THREE.Mesh;
let cylinderRadius: number = 0;

const getDistanceBuffer = (position: any, radius: number) => {
  const geometry = new THREE.CircleGeometry(radius, 120);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_color: { value: new THREE.Color(0x00ff00) },
      u_r: { value: 0.1 },
      u_ring: { value: 0.03 },
    },
    transparent: true,
    vertexShader: vs,
    fragmentShader: fs,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);

  updateHalfSphere(mesh, radius);

  distenceBufferMesh = mesh;

  return mesh;
};

const updateHalfSphere = (mesh: THREE.Mesh, radius: number) => {
  let offset = 0;
  const updateAction = () => {
    if (offset >= radius) offset = 0;
    offset += 0.03;
    // @ts-ignore
    mesh.material.uniforms.u_r.value = offset;
  };
  const animation = () => {
    requestAnimationId = requestAnimationFrame(animation);
    updateAction();
  };
  animation();
};

const cylinderBuffer = (position: any, radius: number) => {
  const colorPng = require("@/assets/city/buildingcolor.png");
  const texture = new THREE.TextureLoader().load(colorPng);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  const geometry = new THREE.CylinderBufferGeometry(radius, radius, 1, 64);
  const materials = [
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    }),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    }),
  ];

  cylinderMesh = new THREE.Mesh(geometry, materials);
  cylinderMesh.position.set(position.x, position.y, position.z);
  cylinderMesh.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0, 0, 0.5)
  );
  cylinderMesh.rotateX(Math.PI * 0.5);

  updateCylinder(radius);

  return cylinderMesh;
};

const updateCylinder = (radius: number) => {
  const updateAction = () => {
    cylinderRadius += 0.01;
    if (cylinderRadius > 1) {
      cylinderRadius = 0;
    }
    if (cylinderMesh) {
      cylinderMesh.scale.set(cylinderRadius, 1, cylinderRadius);
    }
  };
  const animation = () => {
    requestAnimationId2 = requestAnimationFrame(animation);
    updateAction();
  };
  animation();
};

const distenceBufferDestroy = () => {
  if (requestAnimationId) cancelAnimationFrame(requestAnimationId);
  if (distenceBufferMesh) {
    distenceBufferMesh.geometry.dispose();
    // @ts-ignore
    distenceBufferMesh.material.dispose();
  }

  if (requestAnimationId2) cancelAnimationFrame(requestAnimationId2);
  if (cylinderMesh) {
    cylinderMesh.geometry.dispose();
    // @ts-ignore
    cylinderMesh.material[0].dispose();
    // @ts-ignore
    cylinderMesh.material[1].dispose();
    // @ts-ignore
    cylinderMesh.material[2].dispose();
  }
};

export { getDistanceBuffer, distenceBufferDestroy, cylinderBuffer };
