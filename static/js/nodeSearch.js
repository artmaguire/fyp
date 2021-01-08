// Create a Vue Component for the node searching and dropdown lost of search results
// This can be reused for all node searches
// Templating for searching
Vue.component('node-search', {
    data: function () {
        return {
            nodeInput: '',
            isSearching: false,
            searchResults: []
        }
    },
    methods: {
        searchChange: function () {
            handleSearch(this.id, this.nodeInput)
        },
        searchSelected: function (result) {
            this.nodeInput = result.name
            addMarker(result.name, result.lat, result.lon, this.id)
        },
        closeSearchList: function () {
            setTimeout(() => {
                this.isSearching = false
            }, 120);
        }
    },
    props: {id: Number},
    sockets: {
        geoname_result(data) {
            if (data.node !== this.id)
                return;

            this.searchResults = data.geonames;
        }
    },
    template: `<div>
                    <input v-model.trim="nodeInput" v-on:keyup="searchChange" @focus="isSearching = true" @blur="closeSearchList" class="input is-rounded"\n
                           autocomplete="off" type="text" placeholder="Enter location">
                    <div class="sv-suggestions-box-wrapper">
                        <div v-if="isSearching" class="card sv-suggestions-box">
                            <ul class="menu-list">
                                <li v-for="result in searchResults" @click="searchSelected(result)"><a>{{ result.name }}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>`
})

// Helper functions
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