let search = Vue.component('search', {
    data: function () {
        return {
            additionalNodes: [],
            activeType: 'driving',
            searchTypes: [
                {type: 'driving', icon: 'fa-car'},
                {type: 'cycling', icon: 'fa-bicycle'},
                {type: 'walking', icon: 'fa-walking'},
                {type: 'scenic', icon: 'fa-bus'},
                {type: 'scenic', icon: 'fa-truck'}]
        }
    },
    methods: {
        setActiveType(type) {
            this.activeType = type;
        },
        addNode() {
            this.additionalNodes.push({id: Math.random(), component: nodeSearch});
        },
        goButtonClick: function () {
            // Check if marker map has atleast 2 node
            // Call map method to display
            if (markerMap.size < 2 || !markerMap.has(nodes.START) || !markerMap.has(nodes.END)) {
                Swal.fire({
                    title: 'Missing Locations',
                    text: 'You haven\'t selected enough locations!',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(r => console.log('Not enough nodes'));
                return;
            }

            this.$emit('loading', this.activeType);

            axios.get('/route', {
                params: {
                    source: '1',
                    target: '2'
                }
            }).then(response => {
                this.$emit('finished_loading', this.activeType);
                addGeoJSON(JSON.parse(response.data));
            })
            // displayRoute(this.additionalNodes.map(x => x.id));
        },
        deleteNode(id) {
            this.additionalNodes = this.additionalNodes.filter(node => node.id !== id);
        }
    },
    template: `
    <div id="search-view" class="box">
        <div class="search-view-header">
            <p>Direction Finding Using OSM</p>
        </div>
        <div class="search-view-section">
            <div class="card">
                <div id="transport-icons">
                    <ul class="icon-text">
                      <li v-for="searchType in searchTypes" @click="setActiveType(searchType.type)" v-bind:title="searchType.type" class="sv-icon"
                        v-bind:class="{ 'sv-icon-active': activeType === searchType.type }">
                        <i class="fas" :class="searchType.icon"> </i>
                      </li>
                      <!-- TODO: Add more gifs for bus and truck? -->
                    </ul>
                </div>
            </div>
            <div class="sv-inputs">
                <!-- Templating for search nodes, done by Vue Component -->
                <node-search :id="0" :index="0"></node-search>
                <node-search v-for="(child, index) in additionalNodes" :id="child.id" :index="index+1" :key="child.id">
                    <hr style="margin: 2px;">
                </node-search>
                <hr style="margin: 2px;">

                <!-- Templating for search nodes, done by Vue Component -->
                <node-search :id="-1" :index="-1"></node-search>
            </div>
            <div id="checkbox-search-btn sv-container">
                <div class="sv-item">
                    <button class="button add-node" title="Add location" @click="addNode" :disabled="additionalNodes.length >= 5">
                        <i class="fa fa-plus"></i>
                    </button>
                    <div id="search-btn">
                        <button id="go-button" title="Find route" class="button is-rounded" @click="goButtonClick">
                            <span>Go</span>
                            <div class="icon is-small">
                                <i class="fa fa-check"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`
});

// Enum for start and node
const nodes = {
    START: 0,
    END: -1
};