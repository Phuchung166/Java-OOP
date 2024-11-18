import { WINDY_API_KEY, geojson } from "./variables.js";

console.log('WINDY_API_KEY:', WINDY_API_KEY);

const options = {
    key: WINDY_API_KEY,
    verbose: true,
    lat: 21.028511,
    lon: 105.804817,
    zoom: 5,
};

// Function to convert from EPSG:3857 to EPSG:4326
function epsg3857ToEpsg4326(coordinates) {
    const x = (coordinates[0] * 180) / 20037508.34;
    let y = (coordinates[1] * 180) / 20037508.34;
    y = (Math.atan(Math.exp(y * (Math.PI / 180))) * 360) / Math.PI - 90;
    return [x, y];
}

// Create a function to convert coordinates array to GeoJSON LineString
function coordsToGeoJSON(coordinates) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": coordinates.map(coord => epsg3857ToEpsg4326(coord))
        },
        "properties": {}
    };
}

// Function to fetch data
function fetchData(formData) {
    return fetch('/submit-cities', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return data.list_result;
    });
}

// ---------------------------------------

let isSatelliteView = false;
let satelliteLayer = null;

windyInit(options, windyAPI => {
    const { map } = windyAPI;
    map.options.maxZoom = 18;
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 1,
        maxZoom: 18
    });
    
    const toggleButton = document.getElementById('mapToggle');
    const toggleIcon = toggleButton.querySelector('i');
    const toggleText = toggleButton.querySelector('span');

    toggleButton.addEventListener('click', () => {
        isSatelliteView = !isSatelliteView;

        if (isSatelliteView) {
            satelliteLayer.addTo(map);
            toggleIcon.className = 'fas fa-satellite';
            toggleText.textContent = 'Satellite View';
        } else {
            map.removeLayer(satelliteLayer);
            toggleIcon.className = 'fas fa-map';
            toggleText.textContent = 'Map View';
        }
    });

    // Create a color mapping for different type_struct values
    const typeColors = {
        '6': '#111C2E',    // Deep Dark Blue for Công trình
        '7': '#0448B5',    // Blue for Sạt lở đặc biệt nguy hiểm có kế hoạch
        '8': '#FF0000',    // Red for Sạt lở đặc biệt nguy hiểm đang rà soát
        '9': '#FFFF00',    // Yellow for Sạt lở nguy hiểm
        '65': '#964B00',   // Brown for Khu vực bồi
        '66': '#00FF00',   // Green for Sạt lở bình thường
        '86': '#A020F0',   // Purple for Khu vực khảo sát xói sâu
        '88': '#FF0000',   // Red for Khu vực xói bồi xen kẽ
        '94': '#A020F0'    // Purple for Sạt lở đặc biệt nguy hiểm đang trình
    };

    // Create a fixed base layer group
    const baseLayerGroup = L.layerGroup().addTo(map);
    
    // Create a separate layer group for the coordinate lines
    const coordinateLayerGroup = L.layerGroup().addTo(map);
    
    // Add legend to the map
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

        const typeLabels = {
            '6': 'Công trình',
            '7': 'Sạt lở đặc biệt nguy hiểm có kế hoạch',
            '8': 'Sạt lở đặc biệt nguy hiểm đang rà soát',
            '9': 'Sạt lở nguy hiểm',
            '65': 'Khu vực bồi',
            '66': 'Sạt lở bình thường',
            '86': 'Khu vực khảo sát xói sâu',
            '88': 'Khu vực xói bồi xen kẽ',
            '94': 'Sạt lở đặc biệt nguy hiểm đang trình'
        };

        div.innerHTML = '<h4>Phân loại</h4>';
        Object.entries(typeLabels).forEach(([type, label]) => {
            div.innerHTML += `
                <div style="margin-bottom: 5px;">
                    <span style="
                        display: inline-block;
                        width: 12px;
                        height: 2px;
                        background: ${typeColors[type]};
                        margin-right: 5px;
                    "></span>
                    ${label}
                </div>
            `;
        });
        return div;
    };
    
    legend.addTo(map);

    // Add the initial GeoJSON to the base layer
    L.geoJSON(geojson, {
        style: {
            weight: 1,
            color: 'black',
            opacity: 0.8
        }
    }).addTo(baseLayerGroup);

    // Function to render polylines with icons and image popups
    function renderPolylines(listResult, map) {
        // Clear previous polylines
        coordinateLayerGroup.clearLayers();
      
        // Process each feature in the list result
        listResult.forEach(item => {
            const typeIconClass = `type-icon-${item.type_struct}`;
            const typeColor = typeColors[item.type_struct] || '#808080';
        
            if (item.list_minifeature) {
                item.list_minifeature.forEach(minifeature => {
                    if (minifeature.feature && minifeature.feature.geometry) {
                        const coordinates = minifeature.feature.geometry.coordinates;
                        const lineGeoJSON = coordsToGeoJSON(coordinates);
            
                        // Function to create image carousel HTML
                        function createImageCarousel(images) {
                            if (!images || images.length === 0) return '';
                            
                            const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;
                            
                            let carouselHtml = `
                                <div id="${carouselId}" class="image-carousel" style="position: relative; margin: 8px 0;">
                                    <div class="carousel-container" style="position: relative; width: 100%; height: 200px;">
                            `;
                            
                            images.forEach((imgUrl, index) => {
                                carouselHtml += `
                                    <div class="carousel-slide" style="display: ${index === 0 ? 'block' : 'none'}; position: absolute; width: 100%; height: 100%;">
                                        <img src="${imgUrl}" 
                                             style="width: 100%; 
                                                    height: 100%; 
                                                    object-fit: cover; 
                                                    border-radius: 4px;"
                                             alt="Image ${index + 1}"
                                             onerror="this.parentElement.style.display='none'">
                                    </div>
                                `;
                            });
    
                            if (images.length > 1) {
                                carouselHtml += `
                                    <button onclick="changeSlide('${carouselId}', -1)" 
                                            style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); 
                                                   z-index: 2; background: rgba(0,0,0,0.5); color: white; 
                                                   border: none; border-radius: 50%; width: 30px; height: 30px; 
                                                   cursor: pointer;">←</button>
                                    <button onclick="changeSlide('${carouselId}', 1)" 
                                            style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); 
                                                   z-index: 2; background: rgba(0,0,0,0.5); color: white; 
                                                   border: none; border-radius: 50%; width: 30px; height: 30px; 
                                                   cursor: pointer;">→</button>
                                    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); 
                                              z-index: 2; color: white; background: rgba(0,0,0,0.5); 
                                              padding: 2px 8px; border-radius: 10px;">
                                        1/${images.length}
                                    </div>
                                `;
                            }
                            
                            carouselHtml += `
                                    </div>
                                </div>
                            `;
                            
                            return carouselHtml;
                        }
    
                        // Function to create video player HTML
                        function createVideoPlayer(videoUrl) {
                            if (!videoUrl) return '';
                            
                            return `
                                <div class="video-container" style="margin: 8px 0;">
                                    <video controls style="width: 100%; max-height: 200px; border-radius: 4px;">
                                        <source src="${videoUrl}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            `;
                        }
    
                        // Add the polyline to the coordinate layer group with a popup
                        L.geoJSON(lineGeoJSON, {
                            style: {
                                weight: 3,
                                color: typeColor,
                                opacity: 0.8
                            },
                            onEachFeature: (feature, layer) => {
                                if (minifeature.feature.properties) {
                                    const props = minifeature.feature.properties;
                                    const images = minifeature.image?.sourceImagesList || [];
                                    const videoUrl = minifeature.image?.url_video;
                                    
                                    const popupContent = `
                                        <div style="max-width: 300px;">
                                            <strong style="font-size: 14px;">${props.tennhan || 'No name'}</strong><br>
                                            ${createImageCarousel(images)}
                                            ${createVideoPlayer(videoUrl)}
                                            <div style="margin-top: 8px;">
                                                <strong>Chi tiết:</strong><br>
                                                Chiều dài: ${props.chieudai || 'N/A'} m<br>
                                                ${props.tacdong ? `Tác động: ${props.tacdong}<br>` : ''}
                                                ${props.giaiphap ? `Giải pháp: ${props.giaiphap}<br>` : ''}
                                                ${props.thuocsong ? `Thuộc sông: ${props.thuocsong}<br>` : ''}
                                                ${props.xaref ? `Xã: ${props.xaref}<br>` : ''}
                                                ${props.huyenref ? `Huyện: ${props.huyenref}` : ''}
                                            </div>
                                        </div>
                                    `;
                                    
                                    // Create popup with options for better image/video display
                                    const popup = L.popup({
                                        maxWidth: 320,
                                        maxHeight: 500,
                                        autoPan: true,
                                        className: 'custom-popup'
                                    }).setContent(popupContent);
                                    
                                    layer.bindPopup(popup);
                                }
                            }
                        }).addTo(coordinateLayerGroup);
                        
                        // Add the icon to the middle of the polyline
                        const icon = L.divIcon({
                            className: `${typeIconClass} leaflet-glyph-icon`,
                            html: `<img src="/images/legends/${item.type_struct}.png" width="20" height="20" />`,
                            iconSize: [10, 10],
                            iconAnchor: [10, 10]
                        });
            
                        const midIndex = Math.floor(lineGeoJSON.geometry.coordinates.length / 2);
                        L.marker([
                            lineGeoJSON.geometry.coordinates[midIndex][1],
                            lineGeoJSON.geometry.coordinates[midIndex][0]
                        ], { icon }).addTo(coordinateLayerGroup);
                    }
                });
            }
        });
    }
    window.changeSlide = function(carouselId, direction) {
        const carousel = document.getElementById(carouselId);
        const slides = carousel.getElementsByClassName('carousel-slide');
        let activeIndex = Array.from(slides).findIndex(slide => slide.style.display === 'block');
        
        // Hide current slide
        slides[activeIndex].style.display = 'none';
        
        // Calculate new index
        activeIndex += direction;
        if (activeIndex >= slides.length) activeIndex = 0;
        if (activeIndex < 0) activeIndex = slides.length - 1;
        
        // Show new slide
        slides[activeIndex].style.display = 'block';
        
        // Update counter
        const counter = carousel.querySelector('div[style*="bottom: 10px"]');
        if (counter) {
            counter.textContent = `${activeIndex + 1}/${slides.length}`;
        }
    };
    // Function to render coordinate lines
    function renderCoordinateLines(listResult) {
        renderPolylines(listResult, map);
    }

    // Set up form submission handler
    document.getElementById('requestAPI').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        
        fetchData(formData)
            .then(listResult => {
                console.log('List result:', listResult);
                renderCoordinateLines(listResult);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
window.changeSlide = function(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.getElementsByClassName('carousel-slide');
    let activeIndex = Array.from(slides).findIndex(slide => slide.style.display === 'block');
    
    // Hide current slide
    slides[activeIndex].style.display = 'none';
    
    // Calculate new index
    activeIndex += direction;
    if (activeIndex >= slides.length) activeIndex = 0;
    if (activeIndex < 0) activeIndex = slides.length - 1;
    
    // Show new slide
    slides[activeIndex].style.display = 'block';
    
    // Update counter
    const counter = carousel.querySelector('div[style*="bottom: 10px"]');
    if (counter) {
        counter.textContent = `${activeIndex + 1}/${slides.length}`;
    }
};
    // Optional: Add debug logging for coordinate conversion
    window.debugCoordinates = function(coords) {
        const converted = epsg3857ToEpsg4326(coords);
        console.log('Original (EPSG:3857):', coords);
        console.log('Converted (EPSG:4326):', converted);
    };
});

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

// let currentMapIndex = 0;
// let outdoorLayer = null;
// let satelliteLayer = null;

// windyInit(options, windyAPI => {
//     const { map } = windyAPI;
//     map.options.maxZoom = 18;
//     satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//         minZoom: 1,
//         maxZoom: 18
//     });

//     outdoorLayer = L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/tile/{z}/{x}/{y}.png?key=WpgMCLE79NBR2GHKTcfH', {
//         minZoom: 1,
//         maxZoom: 18,
//         tileSize: 512,
//         zoomOffset: -1,
//         attribution: '© MapTiler © OpenStreetMap contributors'
//     });

//     const toggleButton = document.getElementById('mapToggle');
//     const toggleIcon = toggleButton.querySelector('i');
//     const toggleText = toggleButton.querySelector('span');

//     function updateMapView() {
//         // Remove all layers first
//         if (satelliteLayer) map.removeLayer(satelliteLayer);
//         if (outdoorLayer) map.removeLayer(outdoorLayer);
        
//         // Update based on current index
//         switch(currentMapIndex) {
//             case 0: // Windy map (default)
//                 toggleIcon.className = 'fas fa-wind';
//                 // toggleText.textContent = 'Windy View';
//                 break;
//             case 1: // Satellite view
//                 satelliteLayer.addTo(map);
//                 toggleIcon.className = 'fas fa-satellite';
//                 // toggleText.textContent = 'Satellite View';
//                 break;
//             case 2: // Outdoor view
//                 outdoorLayer.addTo(map);
//                 toggleIcon.className = 'fas fa-mountain';
//                 // toggleText.textContent = 'Outdoor View';
//                 break;
//         }
//     }

//     toggleButton.addEventListener('click', () => {
//         currentMapIndex = (currentMapIndex + 1) % 3; // Cycle through 0, 1, 2
//         updateMapView();
//     });

//     // Initialize with default view
//     updateMapView();


//     // Create a color mapping for different type_struct values
//     const typeColors = {
//         '6': '#111C2E',    // Deep Dark Blue for Công trình
//         '7': '#0448B5',    // Blue for Sạt lở đặc biệt nguy hiểm có kế hoạch
//         '8': '#FF0000',    // Red for Sạt lở đặc biệt nguy hiểm đang rà soát
//         '9': '#FFFF00',    // Yellow for Sạt lở nguy hiểm
//         '65': '#964B00',   // Brown for Khu vực bồi
//         '66': '#00FF00',   // Green for Sạt lở bình thường
//         '86': '#A020F0',   // Purple for Khu vực khảo sát xói sâu
//         '88': '#FF0000',   // Red for Khu vực xói bồi xen kẽ
//         '94': '#A020F0'    // Purple for Sạt lở đặc biệt nguy hiểm đang trình
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
//                         width: 12px;
//                         height: 2px;
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

//     // Function to render polylines with icons and image popups
//     function renderPolylines(listResult, map) {
//         // Clear previous polylines
//         coordinateLayerGroup.clearLayers();
      
//         // Process each feature in the list result
//         listResult.forEach(item => {
//             const typeIconClass = `type-icon-${item.type_struct}`;
//             const typeColor = typeColors[item.type_struct] || '#808080';
        
//             if (item.list_minifeature) {
//                 item.list_minifeature.forEach(minifeature => {
//                     if (minifeature.feature && minifeature.feature.geometry) {
//                         const coordinates = minifeature.feature.geometry.coordinates;
//                         const lineGeoJSON = coordsToGeoJSON(coordinates);
            
//                         // Function to create image carousel HTML
//                         function createImageCarousel(images) {
//                             if (!images || images.length === 0) return '';
                            
//                             const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;
                            
//                             let carouselHtml = `
//                                 <div id="${carouselId}" class="image-carousel" style="position: relative; margin: 8px 0;">
//                                     <div class="carousel-container" style="position: relative; width: 100%; height: 200px;">
//                             `;
                            
//                             images.forEach((imgUrl, index) => {
//                                 carouselHtml += `
//                                     <div class="carousel-slide" style="display: ${index === 0 ? 'block' : 'none'}; position: absolute; width: 100%; height: 100%;">
//                                         <img src="${imgUrl}" 
//                                              style="width: 100%; 
//                                                     height: 100%; 
//                                                     object-fit: cover; 
//                                                     border-radius: 4px;"
//                                              alt="Image ${index + 1}"
//                                              onerror="this.parentElement.style.display='none'">
//                                     </div>
//                                 `;
//                             });
    
//                             if (images.length > 1) {
//                                 carouselHtml += `
//                                     <button onclick="changeSlide('${carouselId}', -1)" 
//                                             style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); 
//                                                    z-index: 2; background: rgba(0,0,0,0.5); color: white; 
//                                                    border: none; border-radius: 50%; width: 30px; height: 30px; 
//                                                    cursor: pointer;">←</button>
//                                     <button onclick="changeSlide('${carouselId}', 1)" 
//                                             style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); 
//                                                    z-index: 2; background: rgba(0,0,0,0.5); color: white; 
//                                                    border: none; border-radius: 50%; width: 30px; height: 30px; 
//                                                    cursor: pointer;">→</button>
//                                     <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); 
//                                               z-index: 2; color: white; background: rgba(0,0,0,0.5); 
//                                               padding: 2px 8px; border-radius: 10px;">
//                                         1/${images.length}
//                                     </div>
//                                 `;
//                             }
                            
//                             carouselHtml += `
//                                     </div>
//                                 </div>
//                             `;
                            
//                             return carouselHtml;
//                         }
    
//                         // Function to create video player HTML
//                         function createVideoPlayer(videoUrl) {
//                             if (!videoUrl) return '';
                            
//                             return `
//                                 <div class="video-container" style="margin: 8px 0;">
//                                     <video controls style="width: 100%; max-height: 200px; border-radius: 4px;">
//                                         <source src="${videoUrl}" type="video/mp4">
//                                         Your browser does not support the video tag.
//                                     </video>
//                                 </div>
//                             `;
//                         }
    
//                         // Add the polyline to the coordinate layer group with a popup
//                         L.geoJSON(lineGeoJSON, {
//                             style: {
//                                 weight: 3,
//                                 color: typeColor,
//                                 opacity: 0.8
//                             },
//                             onEachFeature: (feature, layer) => {
//                                 if (minifeature.feature.properties) {
//                                     const props = minifeature.feature.properties;
//                                     const images = minifeature.image?.sourceImagesList || [];
//                                     const videoUrl = minifeature.image?.url_video;
                                    
//                                     const popupContent = `
//                                         <div style="max-width: 300px;">
//                                             <strong style="font-size: 14px;">${props.tennhan || 'No name'}</strong><br>
//                                             ${createImageCarousel(images)}
//                                             ${createVideoPlayer(videoUrl)}
//                                             <div style="margin-top: 8px;">
//                                                 <strong>Chi tiết:</strong><br>
//                                                 Chiều dài: ${props.chieudai || 'N/A'} m<br>
//                                                 ${props.tacdong ? `Tác động: ${props.tacdong}<br>` : ''}
//                                                 ${props.giaiphap ? `Giải pháp: ${props.giaiphap}<br>` : ''}
//                                                 ${props.thuocsong ? `Thuộc sông: ${props.thuocsong}<br>` : ''}
//                                                 ${props.xaref ? `Xã: ${props.xaref}<br>` : ''}
//                                                 ${props.huyenref ? `Huyện: ${props.huyenref}` : ''}
//                                             </div>
//                                         </div>
//                                     `;
                                    
//                                     // Create popup with options for better image/video display
//                                     const popup = L.popup({
//                                         maxWidth: 320,
//                                         maxHeight: 500,
//                                         autoPan: true,
//                                         className: 'custom-popup'
//                                     }).setContent(popupContent);
                                    
//                                     layer.bindPopup(popup);
//                                 }
//                             }
//                         }).addTo(coordinateLayerGroup);
                        
//                         // Add the icon to the middle of the polyline
//                         const icon = L.divIcon({
//                             className: `${typeIconClass} leaflet-glyph-icon`,
//                             html: `<img src="/images/legends/${item.type_struct}.png" width="20" height="20" />`,
//                             iconSize: [10, 10],
//                             iconAnchor: [10, 10]
//                         });
            
//                         const midIndex = Math.floor(lineGeoJSON.geometry.coordinates.length / 2);
//                         L.marker([
//                             lineGeoJSON.geometry.coordinates[midIndex][1],
//                             lineGeoJSON.geometry.coordinates[midIndex][0]
//                         ], { icon }).addTo(coordinateLayerGroup);
//                     }
//                 });
//             }
//         });
//     }
//     window.changeSlide = function(carouselId, direction) {
//         const carousel = document.getElementById(carouselId);
//         const slides = carousel.getElementsByClassName('carousel-slide');
//         let activeIndex = Array.from(slides).findIndex(slide => slide.style.display === 'block');
        
//         // Hide current slide
//         slides[activeIndex].style.display = 'none';
        
//         // Calculate new index
//         activeIndex += direction;
//         if (activeIndex >= slides.length) activeIndex = 0;
//         if (activeIndex < 0) activeIndex = slides.length - 1;
        
//         // Show new slide
//         slides[activeIndex].style.display = 'block';
        
//         // Update counter
//         const counter = carousel.querySelector('div[style*="bottom: 10px"]');
//         if (counter) {
//             counter.textContent = `${activeIndex + 1}/${slides.length}`;
//         }
//     };
//     // Function to render coordinate lines
//     function renderCoordinateLines(listResult) {
//         renderPolylines(listResult, map);
//     }

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
// window.changeSlide = function(carouselId, direction) {
//     const carousel = document.getElementById(carouselId);
//     const slides = carousel.getElementsByClassName('carousel-slide');
//     let activeIndex = Array.from(slides).findIndex(slide => slide.style.display === 'block');
    
//     // Hide current slide
//     slides[activeIndex].style.display = 'none';
    
//     // Calculate new index
//     activeIndex += direction;
//     if (activeIndex >= slides.length) activeIndex = 0;
//     if (activeIndex < 0) activeIndex = slides.length - 1;
    
//     // Show new slide
//     slides[activeIndex].style.display = 'block';
    
//     // Update counter
//     const counter = carousel.querySelector('div[style*="bottom: 10px"]');
//     if (counter) {
//         counter.textContent = `${activeIndex + 1}/${slides.length}`;
//     }
// };
//     // Optional: Add debug logging for coordinate conversion
//     window.debugCoordinates = function(coords) {
//         const converted = epsg3857ToEpsg4326(coords);
//         console.log('Original (EPSG:3857):', coords);
//         console.log('Converted (EPSG:4326):', converted);
//     };
// });