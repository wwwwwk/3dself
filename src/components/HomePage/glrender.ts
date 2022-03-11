import * as THREE from "three";

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  ambient: THREE.AmbientLight,
  renderer: THREE.WebGLRenderer,
  rainMaterial: THREE.LineBasicMaterial,
  rainGeo: THREE.Line[] = [],
  animateId: number;

const init = (homeContainer: HTMLDivElement) => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    homeContainer.offsetWidth / homeContainer.offsetHeight,
    1,
    1000
  );
  camera.position.set(0, 10, 0);
  ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  scene.fog = new THREE.FogExp2(0x11111f, 0.002);
  renderer.setClearColor(scene.fog.color);
  renderer.setSize(homeContainer.offsetWidth, homeContainer.offsetHeight);
  homeContainer.appendChild(renderer.domElement);

  rainMaterial = new THREE.LineBasicMaterial({
    // map: texture,
    vertexColors: true,
  });

  const points = [
    new THREE.Vector3(-10, -10, -10),
    new THREE.Vector3(10, 10, 10),
  ];
  const pointColor = [0.4, 1, 1, 0, 0, 0];
  const temp = [];
  for (let i = 0; i < 300; i += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(pointColor), 3)
    );
    const line = new THREE.Line(geometry, rainMaterial);
    line.position.set(
      Math.random() * 400 - 200,
      Math.random() * 500 - 250,
      Math.random() * 400 - 200
    );
    scene.add(line);

    temp.push(line);
  }
  rainGeo = temp;

  //   console.log(rainGeo);

  window.addEventListener("resize", onWindowResize);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
  animateId = requestAnimationFrame(animate);
  for (let i = 0; i < rainGeo.length; i += 1) {
    let targetX = rainGeo[i].position.x - 4 - 0.1 * 0.1;
    let targetY = rainGeo[i].position.y - 4 - 0.1 * 0.1;
    let targetZ = rainGeo[i].position.z - 4 - 0.1 * 0.1;
    targetX = targetX < -200 ? 200 : targetX;
    targetY = targetY < -200 ? 200 : targetY;
    targetZ = targetZ < -200 ? 200 : targetZ;

    rainGeo[i].position.set(targetX, targetY, targetZ);
  }

  renderer.render(scene, camera);
};

const destroy = () => {
  rainMaterial.dispose();
  renderer.dispose();
  ambient.dispose();
  window.removeEventListener('resize', onWindowResize);
  rainGeo.forEach((e) => {
    e.geometry.dispose();
  });
  cancelAnimationFrame(animateId);
};

export { init, animate, destroy };
