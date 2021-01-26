// Leaflet JS OpenStreetMapMapbox Map

// Mapbox tokens for different maps
const mapboxAccessToken = 'pk.eyJ1IjoiYXJ0bWFndWlyZSIsImEiOiJja2poYmxqMmUzZDdnMnRtdGUwbXVsMjgyIn0.fptDfptTcoror2IzzbBchg'
const mapBoxURL = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`
const mapBoxAttribute = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'

// Different MapBox maps including: Streets-V11, Dark-V10, Light-V10, Satellite-V11
const streets = L.tileLayer(mapBoxURL, {
        id: 'mapbox/streets-v11',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        attribution: mapBoxAttribute,
        accessToken: mapboxAccessToken
    }),
    dark = L.tileLayer(mapBoxURL, {
        id: 'mapbox/dark-v10',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        attribution: mapBoxAttribute,
        accessToken: mapboxAccessToken
    }),
    light = L.tileLayer(mapBoxURL, {
        id: 'mapbox/light-v10',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        attribution: mapBoxAttribute,
        accessToken: mapboxAccessToken
    }),
    satelliteStreets = L.tileLayer(mapBoxURL, {
        id: 'mapbox/satellite-streets-v11',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        attribution: mapBoxAttribute,
        accessToken: mapboxAccessToken
    });

const maps = new Map();
maps.set("Streets", streets)
maps.set("Dark", dark)
maps.set("Light", light)
maps.set("Satellite", satelliteStreets)

let baseMaps = {
    "Streets": streets,
    "Dark": dark,
    "Light": light,
    "Satellite": satelliteStreets,
};

// Default view is in Ireland
const irelandView = {
    "x": 53.417717,
    "y": -7.945862,
    "zoom": 7
}

// Custom markers
const startIcon = L.icon({
        iconUrl: '/static/images/markers/S.png',
        iconSize: [47, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    endIcon = L.icon({
        iconUrl: '/static/images/markers/E.png',
        iconSize: [47, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    oneIcon = L.icon({
        iconUrl: '/static/images/markers/1.png',
        iconSize: [47, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    twoIcon = L.icon({
        iconUrl: '/static/images/markers/2.png',
        iconSize: [47, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    threeIcon = L.icon({
        iconUrl: '/static/images/markers/3.png',
        iconSize: [47, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    fourIcon = L.icon({
        iconUrl: '/static/images/markers/4.png',
        iconSize: [47, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    fiveIcon = L.icon({
        iconUrl: '/static/images/markers/5.png',
        iconSize: [47, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    });

const map = L.map('mapid').setView([irelandView.x, irelandView.y], irelandView.zoom);

const defaultMap = document.cookie.match(/^(.*;)?\s*baseMap\s*=\s*[^;]+(.*)?$/)
if (defaultMap === null) {
    streets.addTo(map);
} else {
    const baseMap = getPreviousMap()
    baseMaps[baseMap].addTo(map);
}

// Add all map layers
L.control.layers(baseMaps).addTo(map);

// Place zoom controls at bottom right of the screen
map.zoomControl.remove();
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Asks for user location
let userLocation = []
locateUser();


// Button for users location
L.easyButton('<i class="fa fa-map-marker" title="Your location"></i>', function (btn, map) {
    //TODO: Add custom user marker to the map
    if (userLocation.length !== 0) {
        map.flyTo([userLocation[0], userLocation[1]], 14);
    } else
        locateUser()
}, {position: 'bottomright'}).addTo(map);

// Route variable
let routingControl = null

function locateUser() {
    map.locate({enableHighAccuracy: true}) /* This will return map so you can do chaining */
        .on('locationfound', function (e) {
            userLocation = [e.latitude, e.longitude]
            map.setView([e.latitude, e.longitude], 12);
        })
        .on('locationerror', function (e) {
        });
}

function getPreviousMap() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('baseMap'))
        .split('=')[1];
}

const markerMap = new Map();

function addMarker(name, lat, lon, key, id) {
    if (markerMap.has(key))
        map.removeLayer(markerMap.get(key));

    let marker;

    switch (id) {
        case 0:
            marker = L.marker([lat, lon], {icon: startIcon}).addTo(map);
            break;
        case -1:
            marker = L.marker([lat, lon], {icon: endIcon}).addTo(map);
            break;
        case 1:
            marker = L.marker([lat, lon], {icon: oneIcon}).addTo(map);
            break;
        case 2:
            marker = L.marker([lat, lon], {icon: twoIcon}).addTo(map);
            break;
        case 3:
            marker = L.marker([lat, lon], {icon: threeIcon}).addTo(map);
            break;
        case 4:
            marker = L.marker([lat, lon], {icon: fourIcon}).addTo(map);
            break;
        case 5:
            marker = L.marker([lat, lon], {icon: fiveIcon}).addTo(map);
            break;
        default:
            marker = L.marker([lat, lon]).addTo(map);
            break;
    }

    marker.bindPopup("<b>" + name).openPopup();

    markerMap.set(key, marker);
    if (markerMap.size > 1)
        panToMarkers()
    else
        panToNode(lat, lon)
}

function removeMarker(markerId) {
    let marker = markerMap.get(markerId)
    markerMap.delete(markerId)

    map.removeLayer(marker)
}

function removeRoute() {
    if (!routingControl)
        return;

    map.removeControl(routingControl);
    routingControl = null;
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

// Get the lat, lon for a given marker
function getCoords(marker) {
    return L.latLng(marker['_latlng']['lat'], marker['_latlng']['lng'])
}

function displayRoute(additionalNodes) {
    // Check if marker map has atleast 2 node
    // Call map method to display

    if (markerMap.size < 2 || !markerMap.has(nodes.START) || !markerMap.has(nodes.END)) {
        // TODO: Add modal or popup
        alert('You haven\'t selected a start and end point!');
        console.log('Not enough nodes')
        return;
    }

    // Clears any existing routes
    removeRoute()

    let waypoints = []
    waypoints.push(getCoords(markerMap.get(nodes.START)))

    for (let id of additionalNodes) {
        let marker = markerMap.get(id);
        waypoints.push(getCoords(marker));
    }

    waypoints.push(getCoords(markerMap.get(nodes.END)))

    routingControl = L.Routing.control({
        router: L.Routing.mapbox(mapboxAccessToken),
        waypoints: waypoints,
        createMarker: function () {
            return null;
        }
    }).addTo(map);
}

// Saves current map layer to cookie when the user leaves the page
window.onbeforeunload = function () {
    let mapId = 0
    for (let m in map._layers) {
        mapId = m
    }

    let cookieString = "baseMap=";
    for (let m of maps) {
        if (m[1].options['id'] === map._layers[mapId].options['id']) {
            document.cookie = cookieString += m[0];
        }
    }
};

