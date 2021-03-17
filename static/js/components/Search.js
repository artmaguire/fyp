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
            Algorithms: Algorithms,
            algorithmType: Algorithms.BI_ASTAR,
            visualisation: false,
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
                    visualisation: this.visualisation ? 1 : 0
                }
            }).then(response => {
                console.log(response)
                startLatLng = [[nodeMap.get(0).lat, nodeMap.get(0).lon], [response.data.start_point.lat, response.data.start_point.lng]];
                endLatLng = [[nodeMap.get(-1).lat, nodeMap.get(-1).lon], [response.data.end_point.lat, response.data.end_point.lng]];
                addDottedLine(startLatLng);
                addDottedLine(endLatLng);

                if (response.data.branch)
                    for (let branch of response.data.branch)
                        addGeoJSON(JSON.parse(branch.route), branch.cost, branch.distance)

                this.setRouteDetails(response.data.distance, response.data.time)
                if (response.data.history)
                    setRouteHistory(response.data.history);
                else
                    addGeoJSON(JSON.parse(response.data.route), 0, 0, 0, 0, "crimson", 3);
            }).finally(() => {
                this.$store.commit('SET_ROUTE_LOADING', false);
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
                    <button disabled class="button add-node" title="Add location" @click="addNode" :disabled="additionalNodes.length >= 5">
                        <i class="fa fa-plus"></i>
                    </button>
                    <div id="search-btn">
                        <button id="go-button" title="Find route" class="button is-rounded" @click="goButtonClick">
                            <div class="icon is-small">
                                <i class="fa fa-search"></i>
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
                <hr style="margin: 1px">
                <div class="algorithm-radio-buttons">
                    <strong class="start-end-strong">Select an algorithm</strong>
                    <div style="padding-left: 24px;" class="control">
                      <label class="radio">
                        <input type="radio" :value="Algorithms.DIJKSTRA" v-model="algorithmType">
                        Dijkstra
                      </label>
                      <br>
                      <label class="radio" >
                        <input type="radio" :value="Algorithms.BI_DIJKSTRA" v-model="algorithmType">
                        Bi-directional Dijkstra
                      </label>
                      <br>
                      <label class="radio" >
                        <input type="radio" :value="Algorithms.ASTAR" v-model="algorithmType">
                        A*
                      </label>
                      <br>
                      <label class="radio" >
                        <input type="radio" :value="Algorithms.BI_ASTAR" v-model="algorithmType" checked>
                        Bi-directional A*
                      </label>
                    </div>
                </div>
                <div style="padding-left: 16px;" class="algorithm-radio-buttons">
                      <label id="visualisation-checkbox" class="checkbox">
                      <input type="checkbox" v-model="visualisation">
                      <strong class="start-end-strong">Visualisation</strong>
                    </label>
                </div>
            </div>
            <div class="algorithm-radio-dropdown">
                <button class="button is-rounded is-small expand-search-view-button" @click="expandSearchView" title="Additional Settings">
                    <span v-show="expand">
                        <i style="color:crimson" class="fas fa-chevron-up fa-lg"></i>
                    </span>
                    <span v-show="!expand">
                        <i style="color:crimson" class="fas fa-chevron-down fa-lg"></i>
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