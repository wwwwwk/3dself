import * as THREE from "three";

import { getFeaturePoint } from "@/api/earth";
import { lonlatToSphere } from "@/utils/coord";

class FeaturePoi {
  earth: THREE.Mesh;
  featurePoiMesh: THREE.Mesh;
  constructor(earth: THREE.Mesh) {
    this.earth = earth;
    this.featurePoiMesh = new THREE.Mesh();
  }

  async getDatas() {
    const result = await getFeaturePoint();

    return result;
  }

  setPoints(points: any, radius: number, earth: THREE.Mesh) {
    for (let i = 0; i < points.length; i++) {
      const xyCoord = lonlatToSphere(
        points[i].geometry.x,
        points[i].geometry.y,
        radius
      );

      const { resRadius, resOpacity, color, objectId } = this.getCircleOptions(
        points[i].attributes
      );

      const circleGeometry = new THREE.BoxGeometry(0.1, 0.1, resRadius);
      const circleMateria = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: resOpacity,
      });
      circleGeometry.applyMatrix4(
        new THREE.Matrix4().makeTranslation(0, 0, -0.5 * resRadius)
      );
      const circleMesh = new THREE.Mesh(circleGeometry, circleMateria);
      circleMesh.name = objectId;
      circleMesh.position.set(xyCoord.x, xyCoord.y, xyCoord.z);
      circleMesh.lookAt(earth.position);
      circleMesh.updateMatrix();
      this.featurePoiMesh.add(circleMesh);
    }

    earth.add(this.featurePoiMesh);
  }

  getCircleOptions(attributes: any) {
    let resRadius = 0;
    let resOpacity = 0;
    if (attributes.FATALITIES > 20) {
      resRadius = 32 / 8;
      resOpacity = 1.0;
    } else if (attributes.FATALITIES > 15) {
      resRadius = 26 / 8;
      resOpacity = 0.9;
    } else if (attributes.FATALITIES > 10) {
      resRadius = 20 / 8;
      resOpacity = 0.8;
    } else if (attributes.FATALITIES > 5) {
      resRadius = 14 / 8;
      resOpacity = 0.7;
    } else {
      resRadius = 8 / 8;
      resOpacity = 0.6;
    }

    let color = new THREE.Color(1, 1, 1);
    switch (attributes.EVENT_TYPE) {
      case "Protests":
        color = new THREE.Color(237 / 255, 81 / 255, 81 / 255);
        break;
      case "Explosions/Remote violence":
        color = new THREE.Color(20 / 255, 158 / 255, 206 / 255);
        break;
      case "Battles":
        color = new THREE.Color(167 / 255, 198 / 255, 54 / 255);
        break;
      case "Riots":
        color = new THREE.Color(158 / 255, 85 / 255, 156 / 255);
        break;
      case "Violence against civilians":
        color = new THREE.Color(252 / 255, 146 / 255, 31 / 255);
        break;
      case "Strategic developments":
        color = new THREE.Color(255 / 255, 222 / 255, 62 / 255);
        break;
    }

    const objectId = attributes.OBJECTID;

    return { resRadius, resOpacity, color, objectId };
  }

  destroy(earth: THREE.Mesh) {
    // console.log("destroy");
    while (this.featurePoiMesh.children.length > 0) {
      (this.featurePoiMesh.children[0] as THREE.Mesh).geometry.dispose();
      // @ts-ignore
      (this.featurePoiMesh.children[0] as THREE.Mesh).material.dispose();
      this.featurePoiMesh.remove(this.featurePoiMesh.children[0]);
    }
    // console.log(this.featurePoiMesh);

    this.featurePoiMesh.geometry.dispose();
    // @ts-ignore
    this.featurePoiMesh.material.dispose();

    earth.remove(this.featurePoiMesh);
  }
}

export { FeaturePoi };
