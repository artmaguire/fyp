// Leaflet JS OpenStreetMapMapbox Map
const map = L.map('mapid').setView([53.417717, -7.945862], 7);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJ0bWFndWlyZSIsImEiOiJja2poYmxqMmUzZDdnMnRtdGUwbXVsMjgyIn0.fptDfptTcoror2IzzbBchg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXJ0bWFndWlyZSIsImEiOiJja2poYmxqMmUzZDdnMnRtdGUwbXVsMjgyIn0.fptDfptTcoror2IzzbBchg'
}).addTo(map);
map.zoomControl.remove();
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

const markerMap = new Map();

function addMarker(name, lat, lon, key) {
    if (markerMap.has(key))
          map.removeLayer(markerMap.get(key));

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("<b>" + name + "</b><br>I am a popup.").openPopup();

    markerMap.set(key, marker);
}