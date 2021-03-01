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

const geojsonFeature = [{
    "type": "MultiLineString",
    "coordinates": [[[-6.4445072, 53.4016028], [-6.4441885, 53.4009064], [-6.443937, 53.4003562], [-6.4437306, 53.399927], [-6.4435703, 53.3995728]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4435703, 53.3995728], [-6.4435243, 53.399498], [-6.4434394, 53.3994306], [-6.443286, 53.3993541], [-6.4431426, 53.3992755], [-6.4429362, 53.3991876], [-6.4426763, 53.3990947], [-6.4424394, 53.3990105], [-6.4422642, 53.3989492]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4422642, 53.3989492], [-6.4422202, 53.3989983], [-6.4421536, 53.3990373], [-6.4420706, 53.3990627], [-6.4419786, 53.3990722], [-6.441886, 53.3990649], [-6.4418013, 53.3990414]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4418013, 53.3990414], [-6.4416465, 53.3991334], [-6.4414487, 53.399217], [-6.4408201, 53.3994156], [-6.4404237, 53.3995328], [-6.4399103, 53.3997252], [-6.439442, 53.3999269], [-6.4390131, 53.4001383], [-6.4386309, 53.4003623], [-6.4382555, 53.4006208], [-6.4380122, 53.400822], [-6.4377761, 53.4010417], [-6.4373548, 53.4014852], [-6.4370982, 53.4017457], [-6.4366876, 53.4021258], [-6.4365882, 53.4022149]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4365882, 53.4022149], [-6.4365207, 53.4022753]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4365207, 53.4022753], [-6.4365633, 53.4022989], [-6.4365918, 53.402329], [-6.4366034, 53.4023629], [-6.4365971, 53.4023973], [-6.4365734, 53.4024289]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4365734, 53.4024289], [-6.4365359, 53.402454], [-6.4364877, 53.4024713], [-6.436433, 53.4024792], [-6.4363768, 53.4024772]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4363768, 53.4024772], [-6.4362398, 53.4026711], [-6.4360326, 53.4029515], [-6.4356681, 53.4033429], [-6.4352165, 53.4037689], [-6.4349989, 53.4039604], [-6.4345134, 53.4043669], [-6.4338977, 53.4049287], [-6.4334319, 53.4053628], [-6.4332177, 53.4055415], [-6.4328929, 53.40575], [-6.4326716, 53.4058703], [-6.4323146, 53.4060277], [-6.4319738, 53.4061597], [-6.4316275, 53.406282], [-6.4313723, 53.4063575], [-6.4310921, 53.4064256], [-6.4307726, 53.4064895], [-6.4305353, 53.4065235], [-6.4303384, 53.4065525]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4303384, 53.4065525], [-6.4303446, 53.4065856], [-6.4303331, 53.4066181], [-6.4303051, 53.4066469], [-6.4302635, 53.406669]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4302635, 53.406669], [-6.4302123, 53.4066823], [-6.4301567, 53.4066853], [-6.4301024, 53.4066779], [-6.4300546, 53.4066607], [-6.4300183, 53.4066354]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4300183, 53.4066354], [-6.429723, 53.4068007], [-6.4291755, 53.4071512], [-6.4289143, 53.4073403], [-6.4287828, 53.4074641], [-6.4286985, 53.4075444]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4286985, 53.4075444], [-6.4285625, 53.4076869], [-6.4283971, 53.4079203]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4283971, 53.4079203], [-6.4281671, 53.4083206]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4281671, 53.4083206], [-6.4279924, 53.408604]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4279924, 53.408604], [-6.427944, 53.4086723]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.427944, 53.4086723], [-6.4276352, 53.4091451]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4276352, 53.4091451], [-6.4275729, 53.4092383]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4275729, 53.4092383], [-6.4275595, 53.4092582]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4275595, 53.4092582], [-6.4274664, 53.4093295], [-6.427414, 53.4093598], [-6.4273231, 53.4093947], [-6.4271806, 53.4094123]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4271806, 53.4094123], [-6.4270384, 53.4093508]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4270384, 53.4093508], [-6.426578, 53.4091518], [-6.4254093, 53.4086741], [-6.4246137, 53.4084104], [-6.424012, 53.4082295], [-6.4234689, 53.4080931], [-6.4222273, 53.4077922], [-6.4210936, 53.4075023], [-6.4200789, 53.4072528], [-6.4182094, 53.4068368]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4182094, 53.4068368], [-6.4173338, 53.4066751], [-6.4165125, 53.4065404]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4165125, 53.4065404], [-6.4159516, 53.4064513], [-6.4152022, 53.4063412]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4152022, 53.4063412], [-6.4150764, 53.4063224]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4150764, 53.4063224], [-6.4135221, 53.4061092]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4135221, 53.4061092], [-6.4134298, 53.4060962]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4134298, 53.4060962], [-6.4117932, 53.4058553], [-6.4106769, 53.4056871], [-6.409993, 53.4055782], [-6.4089153, 53.4053652], [-6.4080121, 53.4051595], [-6.4072311, 53.404965]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.4072311, 53.404965], [-6.4069258, 53.4048822], [-6.4062822, 53.4046892], [-6.4053061, 53.4043719], [-6.4047709, 53.4041847], [-6.4041483, 53.403949], [-6.4033183, 53.4035889], [-6.4029524, 53.4034245], [-6.4024528, 53.4031901], [-6.401691, 53.4027977], [-6.4011148, 53.4024998], [-6.4005633, 53.4022003], [-6.3998253, 53.4018114]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3998253, 53.4018114], [-6.3995978, 53.4016878]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3995978, 53.4016878], [-6.3989679, 53.4013528], [-6.3987332, 53.4012252]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3987332, 53.4012252], [-6.396106, 53.3998353], [-6.3953839, 53.3994436], [-6.3937842, 53.3985924], [-6.3920856, 53.3976837], [-6.3911439, 53.3971847], [-6.3892675, 53.3961961]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3892675, 53.3961961], [-6.3874173, 53.3952083], [-6.3839211, 53.3933445]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3839211, 53.3933445], [-6.383642, 53.3931933], [-6.3811035, 53.3918436], [-6.3805338, 53.3915507], [-6.3798503, 53.3911755], [-6.3792177, 53.3908329], [-6.378119, 53.3902674], [-6.3758631, 53.3890498]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3758631, 53.3890498], [-6.3732269, 53.3876909]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3732269, 53.3876909], [-6.372926, 53.3875342]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.372926, 53.3875342], [-6.3726338, 53.3873859]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3726338, 53.3873859], [-6.3720446, 53.3870922], [-6.3712008, 53.3866578], [-6.3706577, 53.3863793], [-6.3701325, 53.3861326], [-6.3697042, 53.3859499], [-6.369447, 53.3858466], [-6.3691668, 53.3857574], [-6.3686774, 53.3856112], [-6.3683, 53.3855178], [-6.3679359, 53.3854373], [-6.3673832, 53.3853488], [-6.3669114, 53.385283], [-6.366371, 53.3852243]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.366371, 53.3852243], [-6.3658988, 53.385183], [-6.3654329, 53.3851438], [-6.3649882, 53.3850884], [-6.3644771, 53.3850016]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3644771, 53.3850016], [-6.3641108, 53.3849162], [-6.3637619, 53.3848229]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3637619, 53.3848229], [-6.3634231, 53.3847487], [-6.3630884, 53.3846577], [-6.3627876, 53.3846044], [-6.3625418, 53.3845909], [-6.3623214, 53.3845923], [-6.3621216, 53.3846193], [-6.3618276, 53.3846792], [-6.3616487, 53.3847487], [-6.3614624, 53.3848315], [-6.3612266, 53.3849739], [-6.3609699, 53.3851477]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3609699, 53.3851477], [-6.3604476, 53.3855111]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3604476, 53.3855111], [-6.3600123, 53.3858169], [-6.3594852, 53.3861688], [-6.3590596, 53.3864341], [-6.3584812, 53.3867499], [-6.3577963, 53.3871212], [-6.3570903, 53.3874814], [-6.356319, 53.3878403], [-6.3556309, 53.3881474], [-6.3540005, 53.3888089], [-6.3530926, 53.3891383], [-6.3524178, 53.3893692], [-6.3500074, 53.3902034]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3500074, 53.3902034], [-6.3489492, 53.3906091], [-6.3461329, 53.3916584], [-6.3402911, 53.3938144], [-6.3374586, 53.3948605], [-6.3315124, 53.3970286], [-6.3282733, 53.3982167], [-6.3204559, 53.4011288], [-6.3198173, 53.4013643]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3198173, 53.4013643], [-6.3188924, 53.4017053]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3188924, 53.4017053], [-6.317208, 53.4023098], [-6.3148315, 53.4031829], [-6.3125727, 53.4040265]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3125727, 53.4040265], [-6.3118041, 53.4042977]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3118041, 53.4042977], [-6.3115258, 53.4043959]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3115258, 53.4043959], [-6.310968, 53.4045928]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.310968, 53.4045928], [-6.3104236, 53.4047816]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3104236, 53.4047816], [-6.309201, 53.4051698], [-6.3079793, 53.40552], [-6.3061465, 53.4060004], [-6.3046338, 53.4063426], [-6.303121, 53.4066496], [-6.3015492, 53.406947]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.3015492, 53.406947], [-6.2989958, 53.4073467], [-6.2979712, 53.4074746], [-6.2967534, 53.4076153], [-6.2946935, 53.4077976], [-6.291913, 53.4079789]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.291913, 53.4079789], [-6.2915553, 53.4080022], [-6.2858739, 53.4082534], [-6.2828167, 53.4084244], [-6.2777446, 53.4086591]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2777446, 53.4086591], [-6.2758119, 53.4087771]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2758119, 53.4087771], [-6.2723244, 53.4089868], [-6.2711505, 53.4090755], [-6.270193, 53.4091808], [-6.2691907, 53.4093076]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2691907, 53.4093076], [-6.2682332, 53.4094238], [-6.2668892, 53.4096276]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2668892, 53.4096276], [-6.2665918, 53.4096945]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2665918, 53.4096945], [-6.2663902, 53.4097659]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2663902, 53.4097659], [-6.2661913, 53.4098128], [-6.2660004, 53.409839], [-6.2657832, 53.409835], [-6.2653908, 53.4097628]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2653908, 53.4097628], [-6.2652668, 53.4096944]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2652668, 53.4096944], [-6.2651551, 53.4095346], [-6.2651082, 53.4093966]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2651082, 53.4093966], [-6.2650414, 53.4087658]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2650414, 53.4087658], [-6.2650805, 53.4086573], [-6.2651905, 53.4085022]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2651905, 53.4085022], [-6.265314, 53.4084164]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.265314, 53.4084164], [-6.2654952, 53.4082378], [-6.2655802, 53.4080483], [-6.2655814, 53.4079413], [-6.2655666, 53.4078375], [-6.2654628, 53.4075326], [-6.2653789, 53.4071642]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2653789, 53.4071642], [-6.2650934, 53.4054967]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2650934, 53.4054967], [-6.2650518, 53.4052789]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2650518, 53.4052789], [-6.2650401, 53.4051599]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2650401, 53.4051599], [-6.2649846, 53.4041305]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649846, 53.4041305], [-6.2649713, 53.4038844]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649713, 53.4038844], [-6.2649723, 53.4037879]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649723, 53.4037879], [-6.2649739, 53.4036339]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649739, 53.4036339], [-6.2649766, 53.4033699]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649766, 53.4033699], [-6.2649793, 53.4031017]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649793, 53.4031017], [-6.2649833, 53.4027105], [-6.264986, 53.4024463], [-6.2649664, 53.4021688], [-6.2649118, 53.4018879], [-6.2648422, 53.4017041], [-6.2647483, 53.4015419]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2647483, 53.4015419], [-6.2646991, 53.401457], [-6.2644449, 53.4011311]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2644449, 53.4011311], [-6.2644062, 53.4010936]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2644062, 53.4010936], [-6.2642941, 53.4009572]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2642941, 53.4009572], [-6.2641819, 53.4008226], [-6.2641286, 53.400752], [-6.2639801, 53.4005552], [-6.2638387, 53.4002734], [-6.2637379, 53.400004]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2637379, 53.400004], [-6.2636942, 53.3997618], [-6.2637018, 53.3996139]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2637018, 53.3996139], [-6.2637059, 53.3995333]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2637059, 53.3995333], [-6.2637314, 53.3993476]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2637314, 53.3993476], [-6.2637612, 53.3991306], [-6.2639432, 53.3978061]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2639432, 53.3978061], [-6.2640425, 53.3969442], [-6.264045, 53.3969226]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.264045, 53.3969226], [-6.264045, 53.3967243]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.264045, 53.3967243], [-6.2640422, 53.3965233], [-6.264042, 53.3965054]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.264042, 53.3965054], [-6.2640572, 53.3961709], [-6.2640805, 53.3956565], [-6.2640818, 53.3956288]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2640818, 53.3956288], [-6.2640922, 53.39543], [-6.2640682, 53.3946118]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2640682, 53.3946118], [-6.2640658, 53.3945277], [-6.2640654, 53.3945148]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2640654, 53.3945148], [-6.2640355, 53.394361]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2640355, 53.394361], [-6.264029, 53.39433], [-6.2640009, 53.3941971], [-6.2639976, 53.3941817]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2639976, 53.3941817], [-6.2639723, 53.3940386]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2639723, 53.3940386], [-6.2639109, 53.3935646]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2639109, 53.3935646], [-6.2638429, 53.3930328]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2638429, 53.3930328], [-6.2638394, 53.3929179]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2638394, 53.3929179], [-6.2638359, 53.3928056], [-6.2638248, 53.3922793], [-6.2638163, 53.391873]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2638163, 53.391873], [-6.2638132, 53.3914467], [-6.2638231, 53.3913407], [-6.2638264, 53.3913056]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2638264, 53.3913056], [-6.2638483, 53.3910721], [-6.2639584, 53.390739], [-6.2641485, 53.3902988]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2641485, 53.3902988], [-6.2642173, 53.3901521]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2642173, 53.3901521], [-6.2642361, 53.3901105]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2642361, 53.3901105], [-6.2642793, 53.3900128]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2642793, 53.3900128], [-6.264484, 53.3895497]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.264484, 53.3895497], [-6.2646191, 53.389244]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2646191, 53.389244], [-6.2646744, 53.3891355]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2646744, 53.3891355], [-6.2647154, 53.3890488], [-6.2647275, 53.3890267]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2647275, 53.3890267], [-6.2647755, 53.3889369]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2647755, 53.3889369], [-6.2649912, 53.3885819], [-6.2651108, 53.3882938]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2651108, 53.3882938], [-6.265158, 53.3881603]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.265158, 53.3881603], [-6.2651867, 53.3879639], [-6.2651921, 53.3879268], [-6.265181, 53.3877957], [-6.2650687, 53.3872529]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2650687, 53.3872529], [-6.264984, 53.3868192], [-6.2649746, 53.3867491]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649746, 53.3867491], [-6.2649426, 53.3862361], [-6.2649445, 53.3860329]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2649445, 53.3860329], [-6.2649453, 53.3859189]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2651441, 53.3859289], [-6.2649453, 53.3859189]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2653129, 53.3859378], [-6.2651441, 53.3859289]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2658484, 53.3859659], [-6.2653129, 53.3859378]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2664402, 53.3860002], [-6.265856, 53.3859663], [-6.2658484, 53.3859659]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2665599, 53.3860075], [-6.2664402, 53.3860002]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2668873, 53.3860195], [-6.2666312, 53.3860118], [-6.2665599, 53.3860075]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2668873, 53.3860195], [-6.2668982, 53.3859507]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2668982, 53.3859507], [-6.2669352, 53.3856966], [-6.2671094, 53.3845406], [-6.267119, 53.3844723]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.267119, 53.3844723], [-6.267143, 53.3842985], [-6.267205, 53.3842525]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.267205, 53.3842525], [-6.2671863, 53.3842451], [-6.2671596, 53.3842199]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2671596, 53.3842199], [-6.2671531, 53.3841973], [-6.2671614, 53.3841718], [-6.2671863, 53.3841494]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2671863, 53.3841494], [-6.2672038, 53.3841429]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2672038, 53.3841429], [-6.2672295, 53.3841333], [-6.2672666, 53.3841296], [-6.2673119, 53.3841352], [-6.2673468, 53.3841494], [-6.2673745, 53.3841766]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2674119, 53.3841819], [-6.2673745, 53.3841766]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2691197, 53.3844637], [-6.2675086, 53.3841956], [-6.2674119, 53.3841819]]]
}, {
    "type": "MultiLineString",
    "coordinates": [[[-6.2691197, 53.3844637], [-6.2690997, 53.3845028]]]
}, {"type": "MultiLineString", "coordinates": [[[-6.2690997, 53.3845028], [-6.2687601, 53.3851659]]]}]

L.geoJSON(geojsonFeature).addTo(map);