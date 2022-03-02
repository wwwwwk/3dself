import * as THREE from "three";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

const radToAngle = (rad: number) => {
  return rad * RAD2DEG;
};

const angleToRad = (angle: number) => {
  return angle * DEG2RAD;
};

const lonlatToSphere = (lon: number, lat: number, radius: number) => {
  const phi = angleToRad(90 - lat);
  const theta = angleToRad(180 + lon);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
};

const spherePointDistance = (
  point1: THREE.Vector3,
  point2: THREE.Vector3,
  center: THREE.Vector3,
  radius: number
) => {
  const vector1 = new THREE.Vector3(
    point1.x - center.x,
    point1.y - center.y,
    point1.z - center.z
  );
  const vector2 = new THREE.Vector3(
    point2.x - center.x,
    point2.y - center.y,
    point2.z - center.z
  );
  const dot =
    vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
  const angle = Math.acos(dot);

  return 2 * Math.PI * radius * (angle / (2 * Math.PI));
};

/**
 * lon,lat 转至 2048*1024
 * @params {number} lon
 * @params {number} lat
 */
const lonlatToFlat = (lon: number, lat: number) => {
  const x = ((lon - -180) / 360) * 2048;
  const y = ((90 - lat) / 180) * 1024;
  return { x, y };
};

/**
 * 经纬度转墨卡托
 */
const lonlatToMocart = (lon: number, lat: number) => {
  const x = (lon * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x, y };
};

/**
 * 墨卡托转经纬度
 */
const mocartToLonlat = (x: number, y: number) => {
  const lon = (x / 20037508.34) * 180;
  let lat = (y / 20037508.34) * 180;
  lat =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2);
  return { lon, lat };
};

export {
  lonlatToSphere,
  radToAngle,
  angleToRad,
  spherePointDistance,
  lonlatToFlat,
  lonlatToMocart,
  mocartToLonlat,
};
