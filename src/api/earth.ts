import axios from "axios";

const heatmapUrl =
  "https://ncportal.geoscene.cn:6443/arcgis/rest/services/SampleWorldCities/MapServer/0/query";
const getHeatmapPoint = () => {
  return axios.get(heatmapUrl, { params: { where: "1=1", f: "json" } });
};

const featurePointUrl =
  "https://services.arcgis.com/LG9Yn2oFqZi5PnO5/ArcGIS/rest/services/Armed_Conflict_Location_Event_Data_ACLED/FeatureServer/1/query";
const getFeaturePoint = () => {
  return axios.get(featurePointUrl, {
    params: {
      f: "json",
      where:
        "(EVENT_DATE BETWEEN timestamp '2018-12-18' AND timestamp '2018-12-20')",
      outFields: "*",
    },
  });
};
const getPointMsg = (id: number) => {
  return axios.get(featurePointUrl, {
    params: { f: "json", where: `OBJECTID = '${id}'", outFields: "OBJECTI` },
  });
};

export { getHeatmapPoint, getFeaturePoint, getPointMsg };
