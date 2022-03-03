import * as THREE from "three";

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
  niform sampler2D mapIndex;
  niform sampler2D lookup;
  niform sampler2D outline;
  niform float outlineLevel;

  uniform vec3 surfaceColor;
  uniform vec3 lineColor;
  uniform vec3 lineSelectedColor;
  uniform vec3 selectedColor;
  uniform vec3 u_lightColor;
  uniform float flag;

  vec3 u_lightDirection = vec3(0.0, 1.0, 0.0); //光的入射方向
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec4 mapColor = texture2D(mapIndex, vUv);
    float indexedColor = mapColor.x;
    vec4 lookupColor = texture2D(lookup, vec2(indexedColor, 0.0));
    float outlineColor = texture2D(outline, vUv).x;
    float diffuse = lookupColor.x + indexedColor + outlineColor;
  //   float diffuse = indexedColor + outlineColor;
    vec4 earthColor = vec4(0.0);
    if (flag == 1.0) {
      if (lookupColor.x == 1.0) { // 国家 #FFFFFF
        if (outlineColor > 0.3) { // 此处过滤数值越大 国界越细
          earthColor = vec4(lineColor, 0.8); // 国界的颜色
        } else {
          earthColor = vec4(mix(surfaceColor, vec3(indexedColor), 0.0), 1.0); // 国家的颜色
        }
      } else if (lookupColor.x == 0.0) { // 海洋 #000000
        earthColor = vec4(mix(vec3(1.0), vec3(0.2), 0.86), 1.0); // mix混合白色让海洋亮一些
        vec3 faceNormal = normalize(vNormal); // 表面的法向量
        float nDotL = max(dot(u_lightDirection, faceNormal), 0.0); // 获取入射光线与法向量的夹角
        vec4 AmbientColor = vec4(u_lightColor, 1.0); // 环境光
        vec4 diffuseColor = vec4(u_lightColor, 1.0) * nDotL; // 漫反射光的颜色
        earthColor = earthColor * (AmbientColor + diffuseColor);
      } else if (lookupColor.x == 0.8) { // 点击后选中的背景色
        if (outlineColor > 0.0) {
          earthColor = vec4(lineSelectedColor, 1); // 选中国家的国界颜色
        } else {
          earthColor = vec4(selectedColor, 1); // 选中国家后的陆地颜色
        }
      }
    } else { // flag == 0.0 表示正在进行点击计算
      earthColor = vec4(vec3(diffuse), 1.0);
    }
    gl_FragColor = earthColor;
  }
`;

const setEarthSphere = (domContainer: HTMLDivElement) => {
  const mapIndexPng = require("@/assets/earth/earthindex.png");
  const mapIndex = new THREE.TextureLoader().load(mapIndexPng);
  const render1 = new THREE.WebGLRenderTarget(
    domContainer.offsetWidth,
    domContainer.offsetHeight
  );
  render1.texture = mapIndex;

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
  const render2 = new THREE.WebGLRenderTarget(
    domContainer.offsetWidth,
    domContainer.offsetHeight
  );
  render2.texture = lookupTexture;

  const outlinePng = require("@/assets/earth/earthoutline.png");
  const mapOutline = new THREE.TextureLoader().load(outlinePng);
  const render3 = new THREE.WebGLRenderTarget(
    domContainer.offsetWidth,
    domContainer.offsetHeight
  );
  render3.texture = mapOutline;

  const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
  const earthMaterual = new THREE.ShaderMaterial({
    vertexShader: vs,
    fragmentShader: fs,
    uniforms: {
      mapIndex: { value: render1.texture },
      //   lookup: { value: render2.texture },
      outline: { value: render3.texture },
      outlineLevel: { value: 0.8 },
      surfaceColor: { value: new THREE.Color(9 / 255, 22 / 255, 39 / 255) },
      lineColor: { value: new THREE.Color(57 / 255, 138 / 255, 168 / 255) },
      lineSelectedColor: { value: new THREE.Color(1 / 255, 1 / 255, 1 / 255) },
      selectedColor: { value: new THREE.Color(1 / 255, 1 / 255, 1 / 255) },
      u_lightColor: { value: new THREE.Color(57 / 255, 138 / 255, 168 / 255) },
      flag: { value: 1 },
    },
  });

  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterual);

  return earthMesh;
};

export { setEarthSphere };
