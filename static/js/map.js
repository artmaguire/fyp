// Leaflet JS OpenStreetMapMapbox Map
// Default view is in Ireland
const mapboxAccessToken = 'pk.eyJ1IjoiYXJ0bWFndWlyZSIsImEiOiJja2poYmxqMmUzZDdnMnRtdGUwbXVsMjgyIn0.fptDfptTcoror2IzzbBchg'
const map = L.map('mapid').setView([53.417717, -7.945862], 7);
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
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
    marker.bindPopup("<b>" + name).openPopup();

    markerMap.set(key, marker);
    if (markerMap.size > 1)
        panToMarkers()
    else
        panToNode(lat, lon)
}

function panToNode(lat, lon) {
    map.setView(L.latLng(lat, lon), 12, {
        "animate": true,
        "pan": {
            "duration": 1
        }
    });
}

function panToMarkers() {
    let group = new L.featureGroup(Array.from(markerMap.values()));
    map.fitBounds(group.getBounds());
}

function displayRoute() {
    // Check if marker map has atleast 2 node
    // Call map method to display
    if (markerMap.size >= 2) {
        // console.log(t['0']['_latlng']['lat'])
        let waypoints = []

        for (let value of markerMap.values()) {
            waypoints.push(L.latLng(value['_latlng']['lat'], value['_latlng']['lng']))
        }

        L.Routing.control({
            router: L.Routing.mapbox(mapboxAccessToken),
            waypoints: waypoints
        }).addTo(map);
    } else {
        // TODO: Add modal or popup
        alert('You haven\'t selected a start and end point!');
        console.log('Not enough nodes')
    }
}