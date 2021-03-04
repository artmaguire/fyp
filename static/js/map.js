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

const map = L.map('mapid', {}).setView([irelandView.x, irelandView.y], irelandView.zoom);

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
L.easyButton('<div title="Your location"><i class="fas fa-map-marker-alt"</i></div>', function (btn, map) {
    if (userLocation.length !== 0) {
        map.flyTo([userLocation[0], userLocation[1]], 14);
    } else {
        Swal.fire({
            title: 'Location Denied',
            text: 'To enable location services, Click allow location access in the browsers search bar.',
            icon: 'error',
            confirmButtonText: 'Ok'
        }).then(r => {
            locateUser()
        });
    }
}, {position: 'bottomright'}).addTo(map);

// Route variable
let routingControl = null;

// GeoJSON Layer
let geoJSONLayer = null;

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

function getBoundsLngLat() {
    return map.getBounds().toBBoxString()
}

function addGeoJSON(routeGeoJSON) {
    geoJSONLayer = L.geoJSON(routeGeoJSON, {
        style: function (feature) {
            return {color: "crimson"};
        }
    }).addTo(map);
}

function removeGeoJSON() {
    if (!geoJSONLayer) return;
    map.removeLayer(geoJSONLayer);
}

// j = [{"type":"LineString","coordinates":[[-9.7690467,52.6169353],[-9.7693644,52.6168743],[-9.7699464,52.6167078],[-9.7702708,52.6165961],[-9.7707156,52.6164702],[-9.7711738,52.6163707],[-9.7717558,52.616259],[-9.7721705,52.6161819],[-9.7725719,52.6161291],[-9.7729732,52.6160966],[-9.7734315,52.6160743],[-9.7737793,52.6160479],[-9.7740736,52.6160052],[-9.7744884,52.6159301],[-9.7749733,52.61579],[-9.7753513,52.6156965],[-9.7757326,52.6156214],[-9.7764149,52.6155057],[-9.7769199,52.6154325],[-9.7775989,52.6153452],[-9.7782109,52.6152742],[-9.7794083,52.6151584],[-9.7802378,52.615065],[-9.7806257,52.6150081],[-9.7811776,52.6149269],[-9.7818231,52.6148639],[-9.7821676,52.6148375],[-9.7825255,52.6148396],[-9.7833115,52.6148477],[-9.783967,52.61487],[-9.7844687,52.6148578],[-9.784887508,52.614840453]]},{"type":"MultiLineString","coordinates":[[[-9.7690467,52.6169353],[-9.7694012,52.6180277],[-9.769689,52.6189235],[-9.7697758,52.6192055],[-9.769826,52.6195405],[-9.7699303,52.6201381],[-9.7699422,52.6204525],[-9.7699162,52.6205321],[-9.7696857,52.6205293],[-9.7694459,52.620535],[-9.7678155,52.6208977],[-9.7650768,52.6215571],[-9.7644372,52.6217284],[-9.7639104,52.6217993],[-9.7627959,52.6218341]]]},{"type":"MultiLineString","coordinates":[[[-9.761186,52.6215151],[-9.7627959,52.6218341]]]},{"type":"MultiLineString","coordinates":[[[-9.7506561,52.6193324],[-9.7549449,52.620317],[-9.7563576,52.6206043],[-9.761186,52.6215151]]]},{"type":"MultiLineString","coordinates":[[[-9.7404252,52.6175937],[-9.7422575,52.6180276],[-9.7454907,52.6183707],[-9.7481903,52.618809],[-9.7506561,52.6193324]]]},{"type":"MultiLineString","coordinates":[[[-9.7404252,52.6175937],[-9.7399703,52.6185572]]]},{"type":"MultiLineString","coordinates":[[[-9.7399703,52.6185572],[-9.7389133,52.6204317],[-9.7372733,52.6216617],[-9.7322233,52.624265],[-9.7296798,52.6251026],[-9.7268681,52.6262595]]]},{"type":"MultiLineString","coordinates":[[[-9.7268681,52.6262595],[-9.7140009,52.6316034],[-9.7113752,52.6326755],[-9.7104449,52.6327988]]]},{"type":"MultiLineString","coordinates":[[[-9.7104449,52.6327988],[-9.7101718,52.6332006],[-9.7095749,52.6334516],[-9.7077588,52.6342284],[-9.7039691,52.6357832]]]},{"type":"MultiLineString","coordinates":[[[-9.7039691,52.6357832],[-9.7038949,52.6358145]]]},{"type":"MultiLineString","coordinates":[[[-9.7038949,52.6358145],[-9.7037256,52.6358859]]]},{"type":"MultiLineString","coordinates":[[[-9.7037256,52.6358859],[-9.6994552,52.6376855],[-9.6967826,52.6387598]]]},{"type":"MultiLineString","coordinates":[[[-9.6967826,52.6387598],[-9.6925958,52.6405299],[-9.6907572,52.6412334],[-9.6870338,52.6422439],[-9.6818009,52.6440355]]]},{"type":"MultiLineString","coordinates":[[[-9.6818009,52.6440355],[-9.6799803,52.6446069],[-9.6738662,52.646175],[-9.66751,52.6478708],[-9.6671927,52.648013],[-9.6668645,52.6482537],[-9.6654532,52.6498947],[-9.6637978,52.6517309],[-9.6627604,52.6529603],[-9.6625192,52.6533657],[-9.6624356,52.653524]]]},{"type":"MultiLineString","coordinates":[[[-9.6624356,52.653524],[-9.6622303,52.6542522]]]},{"type":"MultiLineString","coordinates":[[[-9.6622303,52.6542522],[-9.6619414,52.6552772],[-9.6617773,52.6557696],[-9.6616453,52.6559877],[-9.6612945,52.6563931],[-9.6608945,52.6568297],[-9.6608475,52.6568814]]]},{"type":"MultiLineString","coordinates":[[[-9.6608475,52.6568814],[-9.6607124,52.6569629]]]},{"type":"MultiLineString","coordinates":[[[-9.6607124,52.6569629],[-9.6606266,52.6570093]]]},{"type":"MultiLineString","coordinates":[[[-9.6606266,52.6570093],[-9.6598925,52.6574347],[-9.6572419,52.6588193],[-9.6563812,52.6592748],[-9.6561958,52.6594139],[-9.6561108,52.6595042]]]},{"type":"MultiLineString","coordinates":[[[-9.6561108,52.6595042],[-9.656044,52.6596908],[-9.6559255,52.6601727],[-9.6557659,52.6608239],[-9.6553923,52.6613473],[-9.6551254,52.6616881],[-9.6549357,52.6619806],[-9.6548451,52.6622903],[-9.6547303,52.6629342],[-9.6538187,52.6685656],[-9.6535833,52.6700695],[-9.6535612,52.6702104],[-9.6533478,52.6712328]]]},{"type":"MultiLineString","coordinates":[[[-9.6533478,52.6712328],[-9.6532765,52.6716439],[-9.6532082,52.6720219],[-9.6531482,52.6722715],[-9.6531082,52.6723766],[-9.6530682,52.6724352],[-9.6530049,52.672512],[-9.6529182,52.6725818],[-9.6528133,52.6726662]]]},{"type":"MultiLineString","coordinates":[[[-9.6528133,52.6726662],[-9.6524228,52.6729577],[-9.6518779,52.6733833]]]},{"type":"MultiLineString","coordinates":[[[-9.6518779,52.6733833],[-9.6516331,52.673554]]]},{"type":"MultiLineString","coordinates":[[[-9.6516331,52.673554],[-9.6515101,52.6736398]]]},{"type":"MultiLineString","coordinates":[[[-9.6515101,52.6736398],[-9.6513652,52.6737445]]]},{"type":"MultiLineString","coordinates":[[[-9.6513652,52.6737445],[-9.6512104,52.6738689]]]},{"type":"MultiLineString","coordinates":[[[-9.6512104,52.6738689],[-9.6509075,52.6741129],[-9.6508187,52.6741955],[-9.65076,52.6742973],[-9.6507378,52.6743694],[-9.6507229,52.6745014],[-9.6507048,52.6747178],[-9.650686,52.6749347]]]},{"type":"MultiLineString","coordinates":[[[-9.650686,52.6749347],[-9.6506787,52.6751695]]]},{"type":"MultiLineString","coordinates":[[[-9.6506787,52.6751695],[-9.6506528,52.6760414]]]},{"type":"MultiLineString","coordinates":[[[-9.6506528,52.6760414],[-9.6506451,52.6761846]]]},{"type":"MultiLineString","coordinates":[[[-9.6506451,52.6761846],[-9.6506192,52.6766681],[-9.6506024,52.6770083],[-9.6505991,52.6771934]]]},{"type":"MultiLineString","coordinates":[[[-9.6505991,52.6771934],[-9.6506031,52.6773052],[-9.6505964,52.6773894],[-9.650571,52.6774721],[-9.6505436,52.6775284],[-9.6505194,52.6775814]]]},{"type":"MultiLineString","coordinates":[[[-9.6505194,52.6775814],[-9.6505425,52.6776018]]]},{"type":"MultiLineString","coordinates":[[[-9.6505425,52.6776018],[-9.6505487,52.6776298],[-9.6505341,52.6776649],[-9.6505198,52.6776759]]]},{"type":"MultiLineString","coordinates":[[[-9.6505198,52.6776759],[-9.6505053,52.6776872]]]},{"type":"MultiLineString","coordinates":[[[-9.6505053,52.6776872],[-9.6504495,52.6777121],[-9.6503828,52.6777284],[-9.6503106,52.677737],[-9.6502496,52.6777413],[-9.6501896,52.6777396],[-9.6501358,52.6777324],[-9.6500864,52.6777159]]]},{"type":"MultiLineString","coordinates":[[[-9.6500864,52.6777159],[-9.6500649,52.6777032],[-9.6500469,52.6776837],[-9.6500446,52.6776631],[-9.6500455,52.6776433]]]},{"type":"MultiLineString","coordinates":[[[-9.6500455,52.6776433],[-9.6499581,52.6776121],[-9.6497918,52.6775824],[-9.6493004,52.677549],[-9.6488429,52.6775285]]]},{"type":"MultiLineString","coordinates":[[[-9.6488429,52.6775285],[-9.648806,52.6775263]]]},{"type":"MultiLineString","coordinates":[[[-9.648806,52.6775263],[-9.6479644,52.677476]]]},{"type":"MultiLineString","coordinates":[[[-9.6479644,52.677476],[-9.6478071,52.677471]]]},{"type":"MultiLineString","coordinates":[[[-9.6478071,52.677471],[-9.647663,52.6774667]]]},{"type":"MultiLineString","coordinates":[[[-9.647663,52.6774667],[-9.6472204,52.6774572],[-9.6466207,52.6774804]]]},{"type":"MultiLineString","coordinates":[[[-9.6466207,52.6774804],[-9.646439,52.6774913],[-9.6462214,52.6775033],[-9.6459608,52.6775249],[-9.6457278,52.6775528]]]},{"type":"MultiLineString","coordinates":[[[-9.6457278,52.6775528],[-9.6455609,52.6775732],[-9.6453803,52.6775997]]]},{"type":"MultiLineString","coordinates":[[[-9.6453803,52.6775997],[-9.645135,52.6776483]]]},{"type":"MultiLineString","coordinates":[[[-9.645135,52.6776483],[-9.6447122,52.677741]]]},{"type":"MultiLineString","coordinates":[[[-9.6447122,52.677741],[-9.6445928,52.6777711]]]},{"type":"MultiLineString","coordinates":[[[-9.6445928,52.6777711],[-9.6444845,52.6778013],[-9.6440866,52.6779179],[-9.6437359,52.6780367],[-9.6433002,52.6782142],[-9.6429516,52.6783792],[-9.6426193,52.6785569],[-9.6424593,52.6786715],[-9.6423752,52.6787614],[-9.6423409,52.6788072]]]},{"type":"MultiLineString","coordinates":[[[-9.6437709,52.6792763],[-9.6429979,52.6790223],[-9.6426048,52.6788969],[-9.6423409,52.6788072]]]},{"type":"MultiLineString","coordinates":[[[-9.6444851,52.6795024],[-9.6437709,52.6792763]]]},{"type":"MultiLineString","coordinates":[[[-9.6447835,52.6802775],[-9.6444862,52.6795806],[-9.6444851,52.6795024]]]},{"type":"MultiLineString","coordinates":[[[-9.6449515,52.6806675],[-9.6447835,52.6802775]]]},{"type":"MultiLineString","coordinates":[[[-9.6450283,52.6808456],[-9.6449515,52.6806675]]]},{"type":"MultiLineString","coordinates":[[[-9.6452892,52.6814546],[-9.6450283,52.6808456]]]},{"type":"MultiLineString","coordinates":[[[-9.6454799,52.6817667],[-9.6454095,52.68165],[-9.6452892,52.6814546]]]},{"type":"MultiLineString","coordinates":[[[-9.6457318,52.6821843],[-9.6454799,52.6817667]]]},{"type":"MultiLineString","coordinates":[[[-9.6458999,52.6824564],[-9.6458689,52.6824116],[-9.6457318,52.6821843]]]},{"type":"MultiLineString","coordinates":[[[-9.6458999,52.6824564],[-9.6457935,52.6824809]]]},{"type":"MultiLineString","coordinates":[[[-9.6457935,52.6824809],[-9.6454869,52.6825571]]]},{"type":"MultiLineString","coordinates":[[[-9.6454869,52.6825571],[-9.6451868,52.6826318],[-9.6445334,52.6827824]]]},{"type":"MultiLineString","coordinates":[[[-9.6445334,52.6827824],[-9.6442608,52.6828525],[-9.6440242,52.6829426],[-9.6438661,52.6830287],[-9.6434322,52.6832987],[-9.6430187,52.6835662]]]},{"type":"MultiLineString","coordinates":[[[-9.6430187,52.6835662],[-9.6428404,52.6836747],[-9.6425555,52.6838625]]]},{"type":"MultiLineString","coordinates":[[[-9.6425555,52.6838625],[-9.6424751,52.6839526],[-9.6424011,52.6840515]]]},{"type":"MultiLineString","coordinates":[[[-9.6424011,52.6840515],[-9.6422691,52.6842827],[-9.6420445,52.6847389],[-9.6418223,52.6851968],[-9.6415324,52.6857962],[-9.641484,52.6859389],[-9.6414373,52.6861107],[-9.6413982,52.6863347]]]},{"type":"MultiLineString","coordinates":[[[-9.6413982,52.6863347],[-9.6413664,52.6864682]]]},{"type":"MultiLineString","coordinates":[[[-9.6413664,52.6864682],[-9.6412865,52.686908],[-9.6412295,52.6872315],[-9.6411538,52.6875611]]]},{"type":"MultiLineString","coordinates":[[[-9.6411538,52.6875611],[-9.6410556,52.6877724],[-9.6409116,52.6880136],[-9.6404896,52.6887168],[-9.6400505,52.6893886],[-9.6398318,52.6897117],[-9.6395797,52.6900574],[-9.6391735,52.690539],[-9.6390349,52.6906656],[-9.6386524,52.6909441],[-9.6379207,52.6914354]]]},{"type":"MultiLineString","coordinates":[[[-9.6379207,52.6914354],[-9.6376937,52.6915878],[-9.6370429,52.6920198]]]},{"type":"MultiLineString","coordinates":[[[-9.6370429,52.6920198],[-9.6359809,52.6927285]]]},{"type":"MultiLineString","coordinates":[[[-9.6359809,52.6927285],[-9.6356379,52.6929258],[-9.6344,52.6936214],[-9.63305,52.6943743],[-9.6318143,52.6950926],[-9.6314691,52.6953018],[-9.6311832,52.6954937],[-9.6309765,52.6956523],[-9.6306005,52.6959721],[-9.6298486,52.696601],[-9.6291863,52.6971474]]]},{"type":"MultiLineString","coordinates":[[[-9.6291863,52.6971474],[-9.6286964,52.6975364],[-9.6282149,52.6979335]]]},{"type":"MultiLineString","coordinates":[[[-9.6282149,52.6979335],[-9.6274885,52.6985753],[-9.6234024,52.7001382],[-9.623025,52.7004617],[-9.622152,52.7013137],[-9.6218381,52.7014954],[-9.6210528,52.7017708],[-9.6149052,52.703332],[-9.610184,52.7045161]]]},{"type":"MultiLineString","coordinates":[[[-9.610184,52.7045161],[-9.607034,52.705412],[-9.6059668,52.705714],[-9.6056393,52.7057894],[-9.6048349,52.7059105],[-9.602238,52.7062539],[-9.5959698,52.707106],[-9.5943776,52.7072324],[-9.5939435,52.7072875]]]},{"type":"MultiLineString","coordinates":[[[-9.5939435,52.7072875],[-9.5933669,52.7074533],[-9.5929767,52.70765],[-9.5926626,52.7079176],[-9.592467,52.7082364]]]},{"type":"MultiLineString","coordinates":[[[-9.592467,52.7082364],[-9.5923552,52.7087646],[-9.5922189,52.7095737],[-9.5919561,52.710067],[-9.5915773,52.7107708],[-9.5911256,52.7118455]]]},{"type":"MultiLineString","coordinates":[[[-9.5911256,52.7118455],[-9.5909792,52.7121938],[-9.5902245,52.7135528]]]},{"type":"MultiLineString","coordinates":[[[-9.5902245,52.7135528],[-9.5901332,52.7137871]]]},{"type":"MultiLineString","coordinates":[[[-9.5901332,52.7137871],[-9.5900981,52.7138757]]]},{"type":"MultiLineString","coordinates":[[[-9.5900981,52.7138757],[-9.5899944,52.7141118]]]},{"type":"MultiLineString","coordinates":[[[-9.5899944,52.7141118],[-9.5899257,52.7142233],[-9.5893623,52.7152436],[-9.5891806,52.7156937],[-9.5890981,52.7159013],[-9.5889144,52.7165252],[-9.5888706,52.7167429],[-9.588838,52.7170942],[-9.5887926,52.7173367],[-9.5887389,52.717503],[-9.5886935,52.7175893],[-9.5886447,52.7176637],[-9.5883506,52.7180094]]]},{"type":"MultiLineString","coordinates":[[[-9.5883506,52.7180094],[-9.5878971,52.718515]]]},{"type":"MultiLineString","coordinates":[[[-9.5878971,52.718515],[-9.5874216,52.719061]]]},{"type":"MultiLineString","coordinates":[[[-9.5874216,52.719061],[-9.5872607,52.7192457]]]},{"type":"MultiLineString","coordinates":[[[-9.5872607,52.7192457],[-9.5857642,52.720964],[-9.5852631,52.7213102],[-9.5848289,52.7214847],[-9.5842892,52.7216067],[-9.5806768,52.7221819]]]},{"type":"MultiLineString","coordinates":[[[-9.5806768,52.7221819],[-9.5805285,52.7222079]]]},{"type":"MultiLineString","coordinates":[[[-9.5805285,52.7222079],[-9.5529871,52.7266033]]]},{"type":"MultiLineString","coordinates":[[[-9.5529871,52.7266033],[-9.552931,52.7266121]]]},{"type":"MultiLineString","coordinates":[[[-9.552931,52.7266121],[-9.5431178,52.7281671]]]},{"type":"MultiLineString","coordinates":[[[-9.5431178,52.7281671],[-9.5408565,52.7285254],[-9.5387668,52.7288592],[-9.5385125,52.7288997]]]},{"type":"MultiLineString","coordinates":[[[-9.5385125,52.7288997],[-9.5365228,52.7292168],[-9.5302725,52.7301987]]]},{"type":"MultiLineString","coordinates":[[[-9.5302725,52.7301987],[-9.5291108,52.7303807]]]},{"type":"MultiLineString","coordinates":[[[-9.5291108,52.7303807],[-9.5281446,52.7305267],[-9.5272333,52.7306615]]]},{"type":"MultiLineString","coordinates":[[[-9.5272333,52.7306615],[-9.5247406,52.7310301]]]},{"type":"MultiLineString","coordinates":[[[-9.5247406,52.7310301],[-9.5239822,52.7311556],[-9.5238417,52.7311592]]]},{"type":"MultiLineString","coordinates":[[[-9.5238417,52.7311592],[-9.5232841,52.7311168]]]},{"type":"MultiLineString","coordinates":[[[-9.5232841,52.7311168],[-9.5231152,52.7311088],[-9.5229702,52.7311257],[-9.5228305,52.7311667],[-9.5225623,52.7312409],[-9.5222447,52.7313338],[-9.521878,52.731454],[-9.5216993,52.7315056],[-9.521551,52.7315361]]]},{"type":"MultiLineString","coordinates":[[[-9.521551,52.7315361],[-9.5216758,52.7318807],[-9.5218636,52.7325141],[-9.5219848,52.7328633],[-9.5220975,52.7330809],[-9.5222874,52.7332222],[-9.5229512,52.7334746]]]},{"type":"MultiLineString","coordinates":[[[-9.5229512,52.7334746],[-9.523253,52.7335893],[-9.5237787,52.7338069],[-9.5240791,52.7340213],[-9.5243291,52.7342568],[-9.5244847,52.7344614],[-9.5247121,52.7348529],[-9.5248816,52.7351533],[-9.5252754,52.73598],[-9.5253183,52.7364737],[-9.5252861,52.7369934],[-9.5252372,52.7376805]]]},{"type":"MultiLineString","coordinates":[[[-9.5252372,52.7376805],[-9.5252364,52.7376917]]]},{"type":"MultiLineString","coordinates":[[[-9.5252364,52.7376917],[-9.5252325,52.7377469],[-9.5252086,52.7378606],[-9.5251354,52.7379513],[-9.5250419,52.7380171],[-9.5249264,52.7380766]]]},{"type":"MultiLineString","coordinates":[[[-9.5249264,52.7380766],[-9.5247839,52.7381516],[-9.5247052,52.7382002],[-9.5241167,52.7387408],[-9.5234944,52.7392669],[-9.5231756,52.7395597]]]},{"type":"LineString","coordinates":[[-9.5231756,52.7395597],[-9.5230577,52.739668],[-9.5225824,52.7400009],[-9.5217273,52.7404475],[-9.5213626,52.7406813],[-9.5209516,52.7410792],[-9.5204045,52.7417803],[-9.5198927,52.7422337],[-9.5193348,52.7426364],[-9.5187984,52.7428702],[-9.518593785,52.742946297]]}]
// addGeoJSON(j);