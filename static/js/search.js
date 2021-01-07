const search = new Vue({
    el: '#search-view',
    data: {
        message: 'Hello Vue!',
        startNode: '',
        endNode: '',
        startSearchResults: [],
        endSearchResults: []
    },
    methods: {
        searchStartChange: function () {
            handleSearch(nodes.START, this.startNode)
        },
        searchEndChange: function () {
            handleSearch(nodes.END, this.endNode)
        },
        searchSelected: function(result) {
            addMarker(result.name, result.lat, result.lon, 0)
        }
    }
})

// Enum for start and node
const nodes = {
    START: 0,
    END: 1
};

// Websocket to communicate with Flask, for searching geonames
const socket = io();
socket.on('connect', function () {
});
socket.on('geoname_result', (data) => {
    console.log(data);
    switch(data.node) {
        case nodes.START:
            search.startSearchResults = data.geonames;
            break;
        case nodes.END:
            search.endSearchResults = data.geonames;
            break;
        default:
            console.log('NOT A NODE IN: ' + nodes)
    }
});

// time out for searching, stops geonames performance issues
let searchTimeout

function delaySearch(data) {
    socket.emit('geoname_search', data);
}

function handleSearch(node, query) {
    if (searchTimeout)
        clearTimeout(searchTimeout);

    let data = {
        node: node,
        query: query
    }

    searchTimeout = setTimeout(delaySearch, 50, data);
    console.log(query);
}