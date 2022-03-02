import axios from "axios";

const countryStatistics = JSON.stringify([
  {
    statisticType: "count",
    onStatisticField: "COUNTRY",
    outStatisticFieldName: "countOFCOUNTRY",
  },
]);
const countryUrl =
  "https://services.arcgis.com/LG9Yn2oFqZi5PnO5/ArcGIS/rest/services/Armed_Conflict_Location_Event_Data_ACLED/FeatureServer/1/query";
const getCountryUrl = () => {
  return axios.get(countryUrl, {
    params: {
      f: "json",
      returnGeometry: false,
      spatialRel: "esriSpatialRelIntersects",
      outFields: "*",
      groupByFieldsForStatistics: "COUNTRY",
      outStatistics: countryStatistics,
      outSR: 102100,
      where: `(EVENT_DATE BETWEEN timestamp '2018-02-04' AND timestamp '2018-02-25')`
    },
  });
};

export { getCountryUrl };
