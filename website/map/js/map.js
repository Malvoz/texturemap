var defaultCenter = { lng: -75.17758, lat: 39.97833 };
var defaultZoom = 16.5;
var defaultBearing = 0;

function getMapConfig({ simulate, texture }) {
  return {
    style: {
      version: 8,
      name: "Blank",
      id: "blank",
      sprite: window.location.href + "js/polygons-sprite",
      sources: {
        polygons: {
          type: "geojson",
          data: "js/polygon.geojson"
        }
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": "#fff"
          }
        },
        simulate
          ? {
              id: "polygons-fill",
              type: "fill",
              source: "polygons",
              layout: {},
              paint: {
                "fill-color": [
                  "step",
                  ["get", "C_DIG1"],
                  "#ABABAB",
                  1,
                  "#707070",
                  2,
                  "#989898",
                  3,
                  "#5B5B5B",
                  4,
                  "#7E7E7E",
                  5,
                  "transparent",
                  6,
                  "#646464",
                  7,
                  "#A0A0A0",
                  8,
                  "#8E8E8E",
                  9,
                  "#656565"
                ],
                "fill-opacity": 1
              }
            }
          : {
              id: "polygons-fill",
              type: "fill",
              source: "polygons",
              layout: {},
              paint: {
                "fill-color": [
                  "step",
                  ["get", "C_DIG1"],
                  "#bcbd22",
                  1,
                  "#2ca02c",
                  2,
                  "#ff7f0e",
                  3,
                  "#d62728",
                  4,
                  "#9467bd",
                  5,
                  "transparent",
                  6,
                  "#1f77b4",
                  7,
                  "#e377c2",
                  8,
                  "#17becf",
                  9,
                  "#8c564b"
                ],
                "fill-opacity": 1
              }
            },
        texture
          ? {
              id: "polygons-texture",
              type: "fill",
              source: "polygons",
              layout: {},
              filter: ["all", ["match", ["get", "C_DIG1"], [5], false, true]],
              paint: {
                "fill-pattern": [
                  "step",
                  ["get", "C_DIG1"],
                  "tmpoly-plus-100-black",
                  1,
                  "tmpoly-circle-light-100-black",
                  2,
                  "tmpoly-grid-light-200-black",
                  3,
                  "tmpoly-line-vertical-down-light-100-black",
                  4,
                  "tmpoly-caret-200-black",
                  6,
                  "tmpoly-square-100-black",
                  7,
                  "tmpoly-slash-forward-100-black",
                  8,
                  "tmpoly-line-vertical-light-100-black",
                  9,
                  "tmpoly-plus-200-black"
                ],
                "fill-opacity": 1
              }
            }
          : {
              id: "polygons-texture",
              type: "fill",
              source: "polygons",
              layout: {},
              paint: {
                "fill-color": "transparent"
              }
            }
      ]
    },
    minZoom: defaultZoom,
    center: defaultCenter,
    zoom: defaultZoom,
    bearing: defaultBearing,
    pitchWithRotate: false,
    dragRotate: false,
    touchZoomRotate: false,
    maxBounds: [
      -75.17986178398132,
      39.976330828104786,
      -75.17422914505005,
      39.979849588073435
    ]
  };
}

var mapSimulation = new mapboxgl.Map({
  container: "map-default",
  ...getMapConfig({ simulate: false, texture: false })
});

var mapDefault = new mapboxgl.Map({
  container: "map-simulation",
  ...getMapConfig({ simulate: true, texture: false })
});

var mapTexturemap = new mapboxgl.Map({
  container: "map-texturemap",
  ...getMapConfig({ simulate: true, texture: true })
});

var disable = false;
mapDefault.on("move", function() {
  if (!disable) {
    var center = mapDefault.getCenter();
    var zoom = mapDefault.getZoom();
    var pitch = mapDefault.getPitch();
    var bearing = mapDefault.getBearing();
    disable = true;
    mapSimulation.setCenter(center);
    mapSimulation.setZoom(zoom);
    mapSimulation.setPitch(pitch);
    mapSimulation.setBearing(bearing);
    mapTexturemap.setCenter(center);
    mapTexturemap.setZoom(zoom);
    mapTexturemap.setPitch(pitch);
    mapTexturemap.setBearing(bearing);
    disable = false;
  }
});

mapSimulation.on("move", function() {
  if (!disable) {
    var center = mapSimulation.getCenter();
    var zoom = mapSimulation.getZoom();
    var pitch = mapSimulation.getPitch();
    var bearing = mapSimulation.getBearing();
    disable = true;
    mapDefault.setCenter(center);
    mapDefault.setZoom(zoom);
    mapDefault.setPitch(pitch);
    mapDefault.setBearing(bearing);
    mapTexturemap.setCenter(center);
    mapTexturemap.setZoom(zoom);
    mapTexturemap.setPitch(pitch);
    mapTexturemap.setBearing(bearing);
    disable = false;
  }
});

mapTexturemap.on("move", function() {
  if (!disable) {
    var center = mapTexturemap.getCenter();
    var zoom = mapTexturemap.getZoom();
    var pitch = mapTexturemap.getPitch();
    var bearing = mapTexturemap.getBearing();
    disable = true;
    mapDefault.setCenter(center);
    mapDefault.setZoom(zoom);
    mapDefault.setPitch(pitch);
    mapDefault.setBearing(bearing);
    mapSimulation.setCenter(center);
    mapSimulation.setZoom(zoom);
    mapSimulation.setPitch(pitch);
    mapSimulation.setBearing(bearing);
    disable = false;
  }
});

mapTexturemap.addControl(
  new mapboxgl.NavigationControl({ showCompass: false }),
  "top-right"
);

mapDefault.scrollZoom.disable();

mapTexturemap.scrollZoom.disable();

mapSimulation.scrollZoom.disable();
