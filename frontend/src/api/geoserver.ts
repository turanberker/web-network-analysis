import axios from "axios";

// Nginx (prod) ve Vite (dev) /geoserver yolunu GeoServer'a yönlendirir; böylece CORS gerekmez.
export const GEOSERVER_WORKSPACE = "watergis";
export const WMS_URL = `/geoserver/${GEOSERVER_WORKSPACE}/wms`;
export const WFS_URL = `/geoserver/${GEOSERVER_WORKSPACE}/wfs`;

export const geoserverClient = axios.create();
