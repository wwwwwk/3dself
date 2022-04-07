import * as THREE from "three";

const jianbianPng = require("@/assets/city/guangzhaojianbian.png");

const vs = `
  uniform vec3 viewVector;
  varying vec2 vUv;
  uniform float c;
  uniform float p;
  varying float intensity;
  void main()
  {
    vUv = uv;
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(c - dot(vNormal, vNormel), p);      // 供片源着色器使用
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fs = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float offset;
  uniform vec3 glowColor;
  uniform sampler2D backgroundTexture;
  
  varying float intensity;
  varying vec2 vUv;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
  
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 2500.0 * dot(m, g);  // 这里改变了噪声处理的参数
  }
  
  void main() {
    vec2 st = vUv * 1.0;
    st.x *= u_resolution.x / u_resolution.y;
    vec3 color = vec3(0.0);
    vec2 pos = vec2(st*3.);
  
    float DF = 0.0;
  
    // Add a random position
    float a = 0.0;
    vec2 vel = vec2(u_time*.1);
    DF += snoise(pos+vel)*.25+.25;
  
    // Add a random position
    a = snoise(pos*vec2(cos(u_time*0.15),sin(u_time*0.1))*0.1)*3.1415;
    vel = vec2(cos(a),sin(a));
    DF += snoise(pos+vel)*.25+.25;
  
    color = vec3( smoothstep(.7,.75,fract(DF)) );
  
  	// offset随着时间在0 - 1之间不断变化
  	// 带入到获取alpha贴图的参数中做到贴图不断从上到下扫过
    vec4 background = texture2D(backgroundTexture, vec2(vUv.x, vUv.y + offset));
    background.a = clamp(background.a, 0.3, 0.9); // 因为最后与结果相乘，0.3控制整个光照的最低亮度，0.9控制最高亮度，如果开启辉光需要适当降低最低亮度
    // float opacity = max(intensity, color.x) * background.a;
    float opacity = max(0.5, color.x) * background.a;
    gl_FragColor = vec4(glowColor, opacity);
  }
`;

// let mesh: THREE.Mesh;
let requestAnimationId: number;
let halfSphereMesh: THREE.Mesh;

const getHalfSphere = (camera: THREE.PerspectiveCamera) => {
  const geometry = new THREE.SphereGeometry(5, 36, 36, 0, Math.PI * 2, 0, (Math.PI / 180) * 90);

  const texture = new THREE.TextureLoader().load(jianbianPng);
  // 为他增加一个shader材质：
  const material = new THREE.ShaderMaterial({
    uniforms: {
      c: { value: 1.5 }, // 系数
      p: { value: 4 }, // 强度
      backgroundTexture: {
        // 用于实现扫描效果的贴图
        value: texture,
      },
      offset: { value: -0.46 }, // 扫描的偏移量
      u_resolution: {
        // 用于生成噪声
        value: new THREE.Vector2(500, 500),
      },
      u_time: { value: 0.1 }, // 噪声随时间变化
      glowColor: { value: new THREE.Color(0xff0000) }, // 光罩的颜色
      viewVector: {
        // 相机位置
        value: camera.position,
      },
    },
    vertexShader: vs,
    fragmentShader: fs,
    side: THREE.FrontSide,
    depthWrite: false,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotateX(Math.PI / 2);
  mesh.position.set(7, 7, 0);

  updateHalfSphere(mesh);

  halfSphereMesh = mesh;

  return mesh;
};

const updateHalfSphere = (mesh: THREE.Mesh) => {
  let offset = 0;
  const updateAction = () => {
    if (offset >= 1.0) offset = -0.46;
    offset += 0.01;
    // @ts-ignore
    mesh.material.uniforms.offset.value = offset;
  };
  const animation = () => {
    requestAnimationId = requestAnimationFrame(animation);
    updateAction();
  };
  animation();
};

const halfSphereDestroy = () => {
  if(requestAnimationId) cancelAnimationFrame(requestAnimationId);
  if(halfSphereMesh) {
    halfSphereMesh.geometry.dispose();
    // @ts-ignore
    halfSphereMesh.material.dispose();
  }
};

export { getHalfSphere, halfSphereDestroy };
