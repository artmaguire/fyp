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
                {type: 'scenic', icon: 'fa-truck'}],
            algorithmType: 'A*',
            visualisation: false,
            expandIcon: 'fa-arrow-down',
            expandRouteDetails: false,
            distance: '10km',
            time: '8min',
            routeDetails: false,
            expand: false
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

            removeGeoJSON()

            this.$store.commit('SET_ROUTE_LOADING', true)

            let nodeMap = this.$store.getters.getNodes;

            axios.get('/route', {
                params: {
                    source: nodeMap.get(0).lat + ',' + nodeMap.get(0).lon,
                    target: nodeMap.get(-1).lat + ',' + nodeMap.get(-1).lon,
                    algorithmType: this.algorithmType,
                    visualisation: this.visualisation
                }
            }).then(response => {
                this.$store.commit('SET_ROUTE_LOADING', false)
                // addGeoJSON(JSON.parse(response.data.route), 0, 0, 0, 0, "crimson", 3);

                // for (let branch of response.data.branch)
                //     addGeoJSON(JSON.parse(branch.route), branch.cost, branch.distance)

                this.setRouteDetails(response.data.distance, response.data.time)
                setRouteHistory(response.data.history);
            });
            // displayRoute(this.additionalNodes.map(x => x.id));
        },
        deleteNode(id) {
            this.additionalNodes = this.additionalNodes.filter(node => node.id !== id);
        },
        expandSearchView() {
            this.expand = !this.expand;
            console.log(this.expand)
        },
        setRouteDetails(distance, time) {
            this.routeDetails = true;
            this.distance = Math.round(distance * 100) / 100;
            this.time = Math.round(time * 100) / 100;
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
            
            <div class="route-details" v-if="routeDetails">
                <i class="route-stats route-stats-icon fas fa-route"></i>
                <strong class="route-stats">{{ distance }} km</strong>
                <strong class="route-stats"><-></strong>
                <strong class="route-stats">{{ time }} mins</strong>
                <i class="route-stats route-stats-icon fas fa-clock"></i>
            </div>
            
            <div class="addition-settings" v-bind:class="{ expand: expand }">
                <strong class="start-end-strong">Additional Settings</strong>
                <div class="algorithm-radio-buttons">
                    <strong class="start-end-strong">Select an algorithm</strong>
                    <div class="control">
                      <label class="radio">
                        <input type="radio" name="answer" value="A*" v-model="algorithmType" checked>
                        A*
                      </label>
                      <label class="radio" >
                        <input type="radio" name="answer" value="Bi-direction A*" v-model="algorithmType">
                        Bi-direction A*
                      </label>
                    </div>
                </div>
                <div class="algorithm-radio-buttons">
                      <label id="visualisation-checkbox" class="checkbox">
                      <input type="checkbox" v-model="visualisation">
                      <strong class="start-end-strong">Visualisation</strong>
                    </label>
                </div>
            </div>
            <div class="algorithm-radio-buttons">
                <button class="button is-rounded expand-search-view-button" @click="expandSearchView" title="Find route">
                    <span v-show="expand">
                        <i style="color:white" class="fas fa-arrow-up"></i>
                    </span>
                    <span v-show="!expand">
                        <i style="color:white" class="fas fa-arrow-down"></i>
                    </span>
                </button>
            </div>
        </div>
    </div>`
});

// Enum for start and node
const nodes = {
    START: 0,
    END: -1
};