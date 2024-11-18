// import { WINDY_API_KEY, geojson } from "./variables.js";

// console.log('WINDY_API_KEY:', WINDY_API_KEY);

// const options = {
//     key: WINDY_API_KEY,
//     verbose: true,
//     lat: 21.028511,
//     lon: 105.804817,
//     zoom: 5,
// };

// // Function to convert from EPSG:3857 to EPSG:4326
// function epsg3857ToEpsg4326(coordinates) {
//     const x = (coordinates[0] * 180) / 20037508.34;
//     let y = (coordinates[1] * 180) / 20037508.34;
//     y = (Math.atan(Math.exp(y * (Math.PI / 180))) * 360) / Math.PI - 90;
//     return [x, y];
// }

// // Create a function to convert coordinates array to GeoJSON LineString
// function coordsToGeoJSON(coordinates) {
//     return {
//         "type": "Feature",
//         "geometry": {
//             "type": "LineString",
//             "coordinates": coordinates.map(coord => epsg3857ToEpsg4326(coord))
//         },
//         "properties": {}
//     };
// }

// // Function to fetch data
// function fetchData(formData) {
//     return fetch('/submit-cities', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         return data.list_result;
//     });
// }

// // ---------------------------------------

// // Initialize the map and layers
// windyInit(options, windyAPI => {
//     const { map } = windyAPI;
    
//     // Create a color mapping for different type_struct values
//     const typeColors = {
//         '6': '#FF0000',    // Red for Công trình
//         '7': '#FF8C00',    // Dark Orange for Sạt lở đặc biệt nguy hiểm có kế hoạch
//         '8': '#FFD700',    // Gold for Sạt lở đặc biệt nguy hiểm đang rà soát
//         '9': '#FF1493',    // Deep Pink for Sạt lở nguy hiểm
//         '65': '#32CD32',   // Lime Green for Khu vực bồi
//         '66': '#4169E1',   // Royal Blue for Sạt lở bình thường
//         '86': '#800080',   // Purple for Khu vực khảo sát xói sâu
//         '88': '#008080',   // Teal for Khu vực xói bồi xen kẽ
//         '94': '#FF4500'    // Orange Red for Sạt lở đặc biệt nguy hiểm đang trình
//     };

//     // Create a fixed base layer group
//     const baseLayerGroup = L.layerGroup().addTo(map);
    
//     // Create a separate layer group for the coordinate lines
//     const coordinateLayerGroup = L.layerGroup().addTo(map);
    
//     // Add legend to the map
//     const legend = L.control({ position: 'bottomright' });
    
//     legend.onAdd = function() {
//         const div = L.DomUtil.create('div', 'legend');
//         div.style.backgroundColor = 'white';
//         div.style.padding = '10px';
//         div.style.borderRadius = '5px';
//         div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

//         const typeLabels = {
//             '6': 'Công trình',
//             '7': 'Sạt lở đặc biệt nguy hiểm có kế hoạch',
//             '8': 'Sạt lở đặc biệt nguy hiểm đang rà soát',
//             '9': 'Sạt lở nguy hiểm',
//             '65': 'Khu vực bồi',
//             '66': 'Sạt lở bình thường',
//             '86': 'Khu vực khảo sát xói sâu',
//             '88': 'Khu vực xói bồi xen kẽ',
//             '94': 'Sạt lở đặc biệt nguy hiểm đang trình'
//         };

//         div.innerHTML = '<h4>Phân loại</h4>';
//         Object.entries(typeLabels).forEach(([type, label]) => {
//             div.innerHTML += `
//                 <div style="margin-bottom: 5px;">
//                     <span style="
//                         display: inline-block;
//                         width: 20px;
//                         height: 3px;
//                         background: ${typeColors[type]};
//                         margin-right: 5px;
//                     "></span>
//                     ${label}
//                 </div>
//             `;
//         });
//         return div;
//     };
    
//     legend.addTo(map);

//     // Add the initial GeoJSON to the base layer
//     L.geoJSON(geojson, {
//         style: {
//             weight: 1,
//             color: 'black',
//             opacity: 0.8
//         }
//     }).addTo(baseLayerGroup);

//     // Function to render coordinate lines
//     function renderCoordinateLines(listResult) {
//         // Clear previous coordinate lines
//         coordinateLayerGroup.clearLayers();

//         // Process each feature in the list result
//         listResult.forEach(item => {
//             const typeColor = typeColors[item.type_struct] || '#808080'; // Default gray if type not found

//             if (item.list_minifeature) {
//                 item.list_minifeature.forEach(minifeature => {
//                     if (minifeature.feature && minifeature.feature.geometry) {
//                         const coordinates = minifeature.feature.geometry.coordinates;
//                         const lineGeoJSON = coordsToGeoJSON(coordinates);
                        
//                         // Add the line to the coordinate layer group
//                         L.geoJSON(lineGeoJSON, {
//                             style: {
//                                 weight: 3,
//                                 color: typeColor,
//                                 opacity: 0.8
//                             },
//                             onEachFeature: (feature, layer) => {
//                                 if (minifeature.feature.properties) {
//                                     const props = minifeature.feature.properties;
//                                     const popupContent = `
//                                         <strong>${props.tennhan || 'No name'}</strong><br>
//                                         Chiều dài: ${props.chieudai || 'N/A'} m<br>
//                                         Tác động: ${props.tacdong || 'N/A'}<br>
//                                         Ghi chú: ${props.ghichu || 'N/A'}
//                                     `;
//                                     layer.bindPopup(popupContent);
//                                 }
//                             }
//                         }).addTo(coordinateLayerGroup);
//                     }
//                 });
//             }
//         });
//     }

//     // Rest of the code remains the same...
//     // Set up form submission handler
//     document.getElementById('requestAPI').addEventListener('submit', function(event) {
//         event.preventDefault();
//         const formData = new FormData(this);
        
//         fetchData(formData)
//             .then(listResult => {
//                 console.log('List result:', listResult);
//                 renderCoordinateLines(listResult);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     });

//     // Optional: Add debug logging for coordinate conversion
//     window.debugCoordinates = function(coords) {
//         const converted = epsg3857ToEpsg4326(coords);
//         console.log('Original (EPSG:3857):', coords);
//         console.log('Converted (EPSG:4326):', converted);
//     };
// });