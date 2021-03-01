// Create a Vue Component for the node searching and dropdown lost of search results
// This can be reused for all node searches
// Templating for searching
let nodeSearch = Vue.component('node-search', {
    data: function () {
        return {
            nodeInput: '',
            isSearching: false,
            searchResults: []
        }
    },
    methods: {
        searchChange: function () {
            handleSearch(this.id, this.nodeInput);
        },
        searchSelected: function (result) {
            this.nodeInput = result.display_place;
            addMarker(result.display_place, result.lat, result.lon, this.id, this.index);
        },
        closeSearchList: function () {
            setTimeout(() => {
                this.isSearching = false;
            }, 120);
        },
        deleteSearch: function () {
            if (this.nodeInput !== '') {
                if (this.id > 0)
                    this.$parent.deleteNode(this.id);
                else
                    this.nodeInput = '';

                removeMarker(this.id);
            }
        }
    },
    props: {id: Number, index: Number},
    sockets: {
        geoname_result(data) {
            if (data.node !== this.id)
                return;

            console.log(data);
            this.searchResults = data.geonames;
        }
    },
    computed: {
        label: function () {
            switch (this.index) {
                case 0:
                    return 'S'
                case -1:
                    return 'E'
                default:
                    return this.index
            }
        },
        placeholder: function () {
            switch (this.index) {
                case 0:
                    return 'Start'
                case -1:
                    return 'End'
                default:
                    return 'Via'
            }
        }
    },
    template: `<div class="sv-container">
                    <div class="sv-label sv-item">
                        <strong class="start-end-strong">{{ label }}</strong>
                    </div>
                    <div class="sv-input sv-item control has-icons-right">
                        <input v-model.trim="nodeInput" @keyup="searchChange" @focus="isSearching = true"
                        @blur="closeSearchList" class="input is-rounded" autocomplete="off"
                        type="text" :placeholder="placeholder">
                        <span class="icon is-small is-right">
                          <a @click="deleteSearch" class="delete is-small"></a>
                        </span>
                    </div>
                    <div class="sv-suggestions-box-wrapper">
                        <div v-if="isSearching" class="card sv-suggestions-box">
                            <ul class="menu-list">
                                <li v-for="result in searchResults" @click="searchSelected(result)" class="search-menu-item">
                                    <span class="">{{ result.display_place }}</span>
                                    <br>
                                    <span class="search-menu-item-addr">{{ result.display_address }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>`
})

// Helper functions
// time out for searching, stops geonames performance issues
let searchTimeout

function delaySearch(data) {
    data.bounds = getBoundsLngLat();
    socket.emit('geoname_search', data);
}

function handleSearch(node, query) {
    if (searchTimeout)
        clearTimeout(searchTimeout);

    let data = {
        node: node,
        query: query
    }

    searchTimeout = setTimeout(delaySearch, 250, data);
}