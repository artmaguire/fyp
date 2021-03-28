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
            routeDetailsDownload: {},
            expandRouteDetails: false,
            distance: '10km',
            time: '8min',
            routeDetails: false,
            expand: false,
            hideSearchView: false
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
                let err = response?.data?.error?.code;
                if (err && err < 0) {
                    Swal.fire({
                        title: 'Calculation Timeout',
                        text: 'Could not find your route.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    }).then(r => console.log('Not enough nodes'));
                    return;
                }
                startLatLng = [[nodeMap.get(0).lat, nodeMap.get(0).lon], [response.data.start_point.lat, response.data.start_point.lng]];
                endLatLng = [[nodeMap.get(-1).lat, nodeMap.get(-1).lon], [response.data.end_point.lat, response.data.end_point.lng]];
                addDottedLine(startLatLng);
                addDottedLine(endLatLng);

                if (response.data.branch)
                    for (let branch of response.data.branch)
                        addGeoJSON(JSON.parse(branch.route), branch.cost, branch.distance)

                this.setRouteDetails(response.data.distance, response.data.time)
                this.routeDetailsDownload = response.data.route;

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
        },
        collapseSearchView() {
            this.hideSearchView = !this.hideSearchView;
            console.log("show/hide", this.hideSearchView);
        },
        reverseWayPoints() {
            let nodeMap = this.$store.getters.getNodes;

            if (nodeMap.get(0) == null && nodeMap.get(-1) == null) {
                return;
            }

            // TODO: Reverse values at index -1, 0 in the NodeMap
            let start = nodeMap.get(0);
            let end = nodeMap.get(-1);
            nodeMap.set(0, end);
            nodeMap.set(-1, start);

            // TODO: Update the search

            // TODO: Update the UI is markers are already on it
            reverseMarkers(start['address']['name'], end['address']['name']);

            // TODO: Make sure that markerMap and nodeMap arent deleted after the search is finished

        },
        setRouteDetails(distance, time) {
            this.routeDetails = true;
            this.distance = Math.round(distance * 100) / 100;
            this.time = Math.round(time * 100) / 100;
        },
        downloadRoute() {
            const blob = new Blob([this.routeDetailsDownload], {type: 'application/pdf'})
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'route.json'
            link.click()
            URL.revokeObjectURL(link.href)
        }
    },
    template: `
    <div v-bind:class="{ 'show-search-view': hideSearchView }" class="search-view">
        <div class="box search-view-content">
            <div class="search-view-header">
                <p>Direction Finding Using OSM</p>
            </div>
            <div class="search-view-section">
                <div class="card">
                    <div id="transport-icons">
                        <ul class="icon-text">
                          <li v-for="searchType in searchTypes" @click="setActiveType(searchType.type)" v-bind:title="searchType.type" class="sv-icon"
                            v-bind:class="{ 'sv-icon-active': activeType === searchType.type }">
                            <i class="fas" :class="searchType.icon"></i>
                          </li>
                          <!-- TODO: Add more gifs for bus and truck? -->
                        </ul>
                    </div>
                </div>
                <div class="sv-inputs">
                    <!-- Templating for search nodes, done by Vue Component -->
                    <node-search :id="0" :index="0"></node-search>
                    <node-search v-for="(child, index) in additionalNodes" :id="child.id" :index="index+1" :key="child.id">
                        <hr class="search-inputs-hr">
                    </node-search>
                    <hr class="search-inputs-hr">
    
                    <!-- Templating for search nodes, done by Vue Component -->
                    <node-search :id="-1" :index="-1"></node-search>
                </div>
                <div id="checkbox-search-btn sv-container">
                    <div class="sv-item">
                        <button disabled class="button add-node" title="Add location" @click="addNode" :disabled="additionalNodes.length >= 5">
                            <i class="fa fa-plus"></i>
                        </button>
                        <button class="button reverse-waypoints" title="Reverse waypoints" @click="reverseWayPoints">
                            <i class="fa fa-retweet"></i>
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
                    <a title="Export Route" class="route-details-download" @click="downloadRoute"><i class="route-download-icon fas fa-file-export"></i></a>
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
                    <div id="visualisation-checkbox" class="algorithm-radio-buttons">
                          <label id="visualisation-checkbox" class="checkbox">
                          <input type="checkbox" v-model="visualisation">
                          <strong class="start-end-strong">Visualisation</strong>
                        </label>
                    </div>
                </div>
                <div class="algorithm-radio-dropdown">
                    <button class="button is-rounded is-small expand-search-view-button phone-expand" @click="expandSearchView" title="Additional Settings">
                        <span v-show="expand">
                            <i style="color:crimson" class="fas fa-chevron-up fa-lg"></i>
                        </span>
                        <span v-show="!expand">
                            <i style="color:crimson" class="fas fa-chevron-down fa-lg"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div v-show="hideSearchView" class="search-view-collapse-button" @click="collapseSearchView">
            <i class="collapse fas fa-chevron-left"></i>
        </div>
        <div v-show="!hideSearchView" class="box minimised-search-view" @click="collapseSearchView">
            <i class="minimised-search-view-icon fas fa-directions"></i>
        </div>
    </div>
    `
});

// Enum for start and node
const nodes = {
    START: 0,
    END: -1
};