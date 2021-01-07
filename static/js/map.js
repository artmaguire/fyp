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

const socket = io();
socket.on('connect', function () {
});
socket.on('geoname_result', (geonames) => {
    console.log(geonames)
});

searchA = document.getElementById("start-node");
const inputHandler = function (e) {
    socket.emit('geoname_search', {data: e.target.value});
}
searchA.addEventListener('input', inputHandler);