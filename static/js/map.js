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
        iconUrl: 'https://lh3.googleusercontent.com/6wYOEbRE-CKOlwZOjbGjsUXYEuCjt5e2ew6fDFmLlxkgawnIKq7NPSWXnn2MtvmpYmulPWA8Vxj4gPVYySfbfLLN7tsUTLG6yRgssUQOdsFIlLeKk2AtDv_gW1wUy7MrL5HJ4PPYqW7L7vcm5Hp4T5QyRvQpWZCQJj1vycGRJrZmg3OCCUWT7OZTDuspXK1WfDh33FmMq_6UdGUGpbVu__SLigEWfJYoXzTAbJKEhRuZndkauGmwNpAxUWKNdIJz0DXLBctYSd-dkCSkLkFV-AfkmoAkIRuW50lAIXeESgszJfSRW1eqAIvxN_0DY654cJX7d7DzFyJ8UedDcfRgk7LvuGqBiXy2xTAy3R7uVNm2HW9V2vyZ11ZMmiOfIGd9dsG-kqaGvwRBI4ZEe4mu5snM1flqUmFhwlm2kUD8vAg69hNEBPE1zpo4zJh3aVKt5PY6krmQ0pEgwTOk08Rzd5dihHotS5SSw8964ns3bfmHmoItB3vkCPU80Vmp7TggHjMdFNr47UznLjx_WAvOXtZPvJY0hLRd2L5wVo8AlSUkz3_qPAh45xArY4JFvmTw9OLYrkyopi7nWjjJiAjtTM7GD6JaURCDiVTDjrpKKAAw6pAGKp4mYFXd_2yzvm31HDHML2mOgAHGKV-mCTJNRa1JxH0r3u217UgKGoAjSbo43qvPcOPcyjsnrCSGpnw=s50-no?authuser=0',
        iconSize: [50, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    endIcon = L.icon({
        iconUrl: 'https://lh3.googleusercontent.com/oA6MhhhhodW6YKO5VeHvPnqTC5M_DW3LQMecrcZQ_Qetl__gZEMA-xbpWBtX9-xQ7pvod0MU5IvmBAHrccFBfYSQj1OQA6phQ8OTapwmkE2f4S_S31P2NbALy2a03Ndrfyx0LS4jTSr7-Qht5oGot-ThDoixrsIL2Lie1dGaaPYZlK3P1rO8Gm4RNJWPis0N_M8pscnIl16V9Lrbn2e04ludyVUJDgwtFZUbdqWBllNVZou_0f7Z39zC4SRSuXS88EsweXxB4WJaT5ZM6Ao2C7KtdjYw9ai0AMJko4ys80vZbvMmqJxkuNfqdHTfXAW5mtmWwA3a87wFDQce-bwQNeGDJsPwZko60bmmQqCVkthrPQacIBT7YFkYsbuvgbYXfUc6EKCSqm6qYm_gvjeFI0QD8SYCXd2siTXXvN3s6ItU7MYJMTz6BxJTK-jeehaRXgi4t_VZO5MBwkRipJCUKNAywHRaqTrFvuUIuj6kRJ5FMvikZCP6e0txSwm6lMQZMiBV7Zgb4af6UQEPareLVP4A3MXk4QMw3XcMfdR5FsvZW9py44CgrmNBS4iSisyFZv-eJ1DlJotP8Ax5iLsaYG8tFwmb3fdoUJwJo9rdKh0TfVhcAMU5kl9zBl_90ir9a55X9MfmYDmmfsgYY7yd0S8efRfaly_X1XZRR0WJ6XyvAY8dqdVrfeMu7GQTB2o=s50-no?authuser=0',
        iconSize: [50, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    oneIcon = L.icon({
        iconUrl: 'https://lh3.googleusercontent.com/XOIvz4wj3o0b5mxopTKBoha0VW7fkOA674gKEWTUDXMLLnnfyIC8wV5M3iuYdvG_ccOoEMjFuCXEP5CeTmWTFmVSvQDiH30z2bo6Z0V51UmAwjhTQSa93YaXFraT0OGmTjUODOP4fZHD8Nys135WpS_9YT6_UQvEnXqt-LHJCn3s1-Exc953qJIe55ecfgDKiL3KVowCiP-ePl6qHBAD7m-Z7KZYNOYmpCocM8ARw62Phf3UeUz5Q-17hVif2dppddRZP_ikwob16zqHc_Nm1wk88zzTjD5oSe0lviFneFBFKGGV0fM0EBNFtRx2o3xcio9MlVoy34NG0Bi27OLyk2YNX7h1tZa4O1rBtfVeYrauVJa-tp1AZk8iReGakzI9KJpLHreFsVE7mygnlETNhRiYQZe1jOIkyFfBocK16K96rI2CxL3QfsG_mgAaDgYmLtLDmFaDikTGOwlU48TITtncdvKicSvJXAHHQQ5mfaGUvPAz4BUBcUN3pv0b9w7ShuAGbsCbMnQpjawPqXse19u8Bnj0VYrMkld5e_QyZfFUMdFU-ih_Dikz_836Sjv1vbDksL2-1hK8VFCyv2ZQmgCrp0GORo9NuBYh1G97b_Fxrukg9gDOELyFizDZd7GxAHzfp_EOnT11pKGyv1zMukQhhcfp1l290vj0TKBVs47Sv3b48OBMUzGOAUWxCz4=s50-no?authuser=0',
        iconSize: [50, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    twoIcon = L.icon({
        iconUrl: 'https://lh3.googleusercontent.com/Dq3eO7g4VTCCu26WdzZBBEFLRVc89fAPc9nEXwb3aCa5MW981cI-E5IXLEJuxX_iyQoN5vQZq5F8ap0cfPwzB4QUY_YLdYSXG4IiXRTn2WAEZWOeSqpbElN0pqksqTz6ieoscUbiMsA-mitt5yBTv2GCE8b1_9jGYKNHWVkFZUMLPHr2z2eOtTN8VrrDRMp9OPeKpqoWHIXkJDktTLcKkRCugUeNqXel_xKwrqikQ9Bk99hrEIuXXZTsMXyOQ8mW22ThnKjHBco7L8J5eJqCWXXIp8l45gMSlKFWqscLkVqoibc_hdmoBhi-QkICNkO3YChbcTI5eWj-De4oXV8F1fwAqAxA_WW8PgqJqsJamEu3FNC0zuaDvZaaf73H27-l9kn77Uu6H5qc6m1GswrxQML7ANP9xtZMepFdUFxZAVfYH_H19_2VnGy-K7IaonMLr6sMd4X4pKEcGCXeXZeQRL6YlwVrEXCo_6pwl8iQXegsUdmdYywCpFUiV-QUTjEvhHFGOTm04i8HUl4BnbWcLOcxJ6t5FUd53zWSDA4p76JYK7GEH0lpkX-5L9DUCzM3wFDImBQCHKbepUXqz2-sORnK4-ZdjiaoDWfe_d49ND88OPjgNVnYklsVskX_B2DLcstYCrpKc1inNsJcPsKgqn1DouMNLN3Kjp56OTaawdbiAaezlCliIlb-GEDq57Q=s50-no?authuser=0',
        iconSize: [50, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    threeIcon = L.icon({
        iconUrl: 'https://lh3.googleusercontent.com/b-b7VMe39JM__NHG6Hj85GDLdzQlnzBW_9EPTXK5cDoyudn9aJJfMFxCqbcPsHWUxO24ObekWjwQ4KVSnIHm_hxfJX7-xu7oQApYRbupttb2ZHxCiD49LfguY8WYUQQuad6CLjPNTetYg49U-TAMjA7baPDm4Ks3n7OaYhEpUjZ3dBXJjNLsVhHhWO_ai26IurPmVYiht2JN5khKMp4Ql4kz_jCp5nR-1dw_Jdv3pc59RL0BWx00wgB0cbAPxtrmX0UrRpCHuiu9XFz1xHZTkICGgpXxx51NQYRGDcJYHL-P2bdQPfJpT1lOlKxHWbTC5IDyAuM3p_g6CK8skl9PBdJO_cJPAoIzNrIGQ7QPFogrgBDwwGpedZPfgQXMY2RcP9Qz4M_mD8XpmWSy3RC3t7VplJqD2u_2m0MNnQ0iNFHsWxhPaNuDM5FzvR78fGuKa2mGK9laS2pES9S58C1GYqQ99boOmeshRtrkx1rgq5ReKQJHLWyn2ucjkX94lbCjXahCW4CNfsBBrdYnO_cnvUm-U8TsZ52DYswQip2Wob-9PsEGaUH72zB2XRDmPmzr3rpnZ7CJw9qWvWcqpTyGk0szI-_djL4ft4_OWjNIPivs4LweO6J4yq5mCderZf2q-MQ3z2bteG-15PYDSRLMQioqlS7XWy-Mhz-gn8_TsrvbU54DKgeZvoUkSxjYBew=s50-no?authuser=0',
        iconSize: [50, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    fourIcon = L.icon({
        iconUrl: 'https://lh3.googleusercontent.com/IKJUt6ySwyjPo1nzH0sfjBbAKjEDeQmFpbPQgnKQ9pWToskFtOZCMb9fNebJ-eQsSE_jdgb5XbExZJOjZlyBo-V0ozuXf1dO-IqWGhf7dzs46RWzp97yf4eSXHp9M0pctzggLiyBR1hoOFniMYcGicOw5GK7lahMSuFGYOUO7Hnes2TtoUaGNXg3vC8zp94yhRqL7Nmm_x1rbKNnxNf_DYioDy5tZuuc3nLOAGt6hNDq0En2jvcNF8HJkbfQZMzTBf7q_1dp-Xlqtrf32AEPdE_X2FV60r0t69HRcTC1rwbExesd5nNiK6mAVgI8GSYCOYj-Dyj--HXAGkaGTq4OsI0kK7L6VNS9Dvg3didK0fzptQf3XVElP2TitNI5FPCVJGSLoWsAUyIdcEO4qIhIErytQD3Epf7HddIF7DP0Gn9bFilXxVUCSTfjKtsj0Ra5sMp_M048DkHHgV8MC2Z1fHQpHj08r4Xnc3_xBZdtEGGbAffdmZxh3agaKxiD_CtxMrVYsFlMyEcZIfqcEtloXVCaNB_zko6KROJ09sya3NqiE-pZTGBgHTwFmKPrR5-VSQKJNozmJJJSBb3Wwuk8N4jH1GlT9q0q6NsnnPB17kulpf_uD5dExHC0ZJmH2bIbUNvFdSj70caFUR2w5_cHIAI6xx2dSXxXN4DEJO5zXTLJV3zCwRFo9ajMlmVaWFY=s50-no?authuser=0',
        iconSize: [50, 50],
        iconAnchor: [22, 48],
        popupAnchor: [4, -45],
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    }),
    fiveIcon = L.icon({
        iconUrl: 'https://lh3.googleusercontent.com/zsRm46e7nLQjtRmrAlyEIWWnR-XVK6_lK0FCWFBaDhDwy1oQklVfJ7Ye-KkrusrdUl_09HOkDzKQV7Iq5d5cTb8ajGffssBj_MnoF8pINacCd2GI-NguMPQUM9GxBCq5KrgbHOOYcNy6oQmcu8NJ71ZXFn92EylkeRLqOUBBF1f1j2xsaL_1O5tLeNTTffGKrzt5V0WkNRaAoPlSrtropp-vvKmOO6AVjeFckols7gTO-LjIiFywzXkRY3WxCmlO-K_1bfuxfSoxpxwleAv15s4pfdl1uU9tlSGbWV9qNZJo6tIs0dMGKahroIs7rpnl05yHrx3e_Z8Ej4JUQXBwx_oXGZMsuRDXA-ri0OUBQ4cMIkzPD8H28-EouSMlobT-YN5nnpzXaCgJr8EiA-Dc_rTQKeoJoRZlrByibmS0JLFNHXQ_HsEQQTAP_Sdj634ntesMfdFj15t-hd62sj-4jHMIsTCwPgimOabkUtIcEvbSilyaLUXkqOZHQSsSyBiuZGrNRVPYh1J32q9iXR22z9yekHvGcD0abVva_SuG3I3xxpFXOXu7Dxy-lAqv-yRegVYQPEUfRbO-JhDJ2I3RAozNDrrkA8tygYn7FVgtwSvk_9D-29Qddm1rgbYfIoZJbLsYSlFalz2v9drO7F3UxJ-O1D-Qh82K31qsfp7lAkhbl8fjojF5aon8cEvCJ4M=s50-no?authuser=0',
        iconSize: [50, 50],
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
    document.getElementById("loading-background").className = 'is-visible';


    let waypoints = []
    waypoints.push(getCoords(markerMap.get(nodes.START)))

    for (let id of additionalNodes) {
        let marker = markerMap.get(id);
        waypoints.push(getCoords(marker));
    }

    waypoints.push(getCoords(markerMap.get(nodes.END)))

    document.getElementById("loading-background").className = 'is-invisible';
    L.Routing.control({
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

