import { Vector2 } from "three";
import {lonlatToMocart} from "@/utils/coord";

// const center = [13170315, 4204472.625];
const center = [12956401.5, 4853758];

// 读 featurecollection的
const getPositionFromJson = (geoJson: any, height: number = 0) => {
  const result = [];
  for (let i = 0; i < geoJson.features.length; i++) {
    const geometry = geoJson.features[i].geometry;
    const type = geometry.type;
    const tmpHeight = height === 0 ? 0 : Math.random() * height;

    const tmp = {
      type,
      height: tmpHeight,
      position: [],
    };

    switch (type) {
      case "Point":
        tmp.position = getPointJson(geometry.coordinates, height);
        result.push(tmp);
        break;
      case "LineString":
        tmp.position = getLineJson(geometry.coordinates, height);
        result.push(tmp);
        break;
      case "Polygon":
        tmp.position = getPolygonJson(geometry.coordinates, height);
        result.push(tmp);
        break;
    }
  }

  return result;
};

const getPointJson: any = (input: any, height:number) => {
  const result = [];
  // result.push(new Vector2(input[0]-center[0], input[1]-center[1]));
  result.push(new Vector2(input[0], input[1]));
  return result;
};

const getLineJson: any = (input: any, height:number) => {
  const result = [];
  for (let i = 0; i < input.length; i++) {
    // result.push((input[i][0]-center[0])/1000, (input[i][1]-center[1])/1000);
    
    const {x, y} = lonlatToMocart(input[i][0], input[i][1]);
    result.push((x-center[0])/100, (y-center[1])/100);
  }

  return result;
};

const getPolygonJson: any = (input: any, height:number) => {
  const result = [];
  for (let i = 0; i < input.length; i++) {
    const tmp = [];
    for (let j = 0; j < input[i].length; j++) {
      // tmp.push((input[i][j][0]-center[0])/1000, (input[i][j][1]-center[1])/1000);
      
      const {x, y} = lonlatToMocart(input[i][j][0], input[i][j][1]);
      tmp.push((x-center[0])/100, (y-center[1])/100);
    }
    result.push(...tmp);
  }
  return result;
};

export { getPositionFromJson };
