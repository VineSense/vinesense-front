
var raster = new ol.layer.Tile({
                  source: new ol.source.OSM({layer: 'sat'})
                });
                
                var source = new ol.source.Vector();

                var vector = new ol.layer.Vector({
                  source: source,
                  style: new ol.style.Style({
                  fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                  }),
                  stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                  }),
                  image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                    color: '#ffcc33'
                    })
                  })
                  }),
                  renderers: ["Canvas"]
                });

                var map = new ol.Map({
                  layers: [raster, vector],
                  target: 'map',
                  view: new ol.View({
                  center: ol.proj.transform([ -122.30068, 38.34942], 'EPSG:4326', 'EPSG:3857'),
                  zoom: 17
                  })
                });
              
                var typeSelect = document.getElementById('type');

                var draw; // global so we can remove it later
                function addInteraction() {
                  var value = 'Polygon'//typeSelect.value;
                  if (value !== 'None') {
                  draw = new ol.interaction.Draw({
                    source: source,
                    type: 'ol.geom.Polygon'///** @type {ol.geom.GeometryType} */ (value)
                  });
                  map.addInteraction(draw);
                  }
                }

                /**
                 * Let user change the geometry type.
                 * @param {Event} e Change event.
                 */
                typeSelect.onchange = function(e) {
                  map.removeInteraction(draw);
                  addInteraction();
                };

                addInteraction();


