let search = Vue.component('search', {
    data: function () {
        return {
            additionalNodes: [],
            searchTypes: [
                {type: 'driving', icon: 'fa-car', flag: 1},
                {type: 'cycling', icon: 'fa-bicycle', flag: 2},
                {type: 'walking', icon: 'fa-walking', flag: 4},
                {type: 'courier', icon: 'fa-truck', flag: 1}],
            activeType: {},
            Algorithms: Algorithms,
            algorithmType: Algorithms.BI_ASTAR,
            visualisation: false,
            routeDetailsDownload: {},
            expandRouteDetails: false,
            distance: '',
            time: '',
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

            this.$store.commit('SET_ROUTE_LOADING', this.activeType.type)

            let nodeMap = this.$store.getters.getNodes;

            axios.get('/route', {
                params: {
                    source: nodeMap.get(0).lat + ',' + nodeMap.get(0).lon,
                    target: nodeMap.get(-1).lat + ',' + nodeMap.get(-1).lon,
                    via1: (nodeMap.has(1)) ? nodeMap.get(1).lat + ',' + nodeMap.get(1).lon : '',
                    via2: (nodeMap.has(2)) ? nodeMap.get(2).lat + ',' + nodeMap.get(2).lon : '',
                    via3: (nodeMap.has(3)) ? nodeMap.get(3).lat + ',' + nodeMap.get(3).lon : '',
                    via4: (nodeMap.has(4)) ? nodeMap.get(4).lat + ',' + nodeMap.get(4).lon : '',
                    via5: (nodeMap.has(5)) ? nodeMap.get(5).lat + ',' + nodeMap.get(5).lon : '',
                    nodeMap: JSON.stringify(Array.from(nodeMap.entries())),
                    algorithmType: this.algorithmType,
                    visualisation: this.visualisation ? 1 : 0,
                    flag: this.activeType.flag
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

                let time = 0, distance = 0;
                let downloadRoute = [];

                for (let route of response.data) {
                    startLatLng = [[route.source_point.lat, route.source_point.lng], [route.start_point.lat, route.start_point.lng]];
                    targetLatLng = [[route.target_point.lat, route.target_point.lng], [route.end_point.lat, route.end_point.lng]];
                    addDottedLine(startLatLng);
                    addDottedLine(targetLatLng);

                    if (route.branch)
                        for (let branch of route.branch)
                            addGeoJSON(JSON.parse(branch.route), branch.cost, branch.distance);

                    time += route.time
                    distance += route.distance
                    downloadRoute.push(JSON.parse(route.route));

                    if (route.history)
                        setRouteHistory(route.history);
                    else
                        addGeoJSON(JSON.parse(route.route), 0, 0, 0, 0, "crimson", 3);
                }

                this.setRouteDetails(distance, this.formatTime(time));
                this.routeDetailsDownload = JSON.stringify(downloadRoute);

            }).finally(() => {
                this.$store.commit('SET_ROUTE_LOADING', null);
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
        },
        reverseWayPoints() {
            let nodeMap = this.$store.getters.getNodes;

            if (nodeMap.get(0) == null && nodeMap.get(-1) == null) {
                return;
            }

            let start = nodeMap.get(0);
            let end = nodeMap.get(-1);
            nodeMap.set(0, end);
            nodeMap.set(-1, start);

            // TODO: Update the search
            this.$store.commit('SET_NODE_MAP', nodeMap);

            reverseMarkers(start['address']['name'], end['address']['name']);
        },
        setRouteDetails(distance, time) {
            this.routeDetails = true;
            this.distance = Math.round(distance * 100) / 100;
            this.time = time;
        },
        downloadRoute() {
            const blob = new Blob([this.routeDetailsDownload], {type: 'application/pdf'})
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'route.json'
            link.click()
            URL.revokeObjectURL(link.href)
        },
        formatTime(time) {
            let routeTime = parseFloat(time)
            if (routeTime < 60) {
                let minutes = Math.ceil(routeTime);
                minutes = (minutes < 2) ? minutes += 'min' : minutes += ' mins';
                return minutes;
            } else {
                let hours = Math.floor(routeTime / 60);
                let minutes = Math.ceil((routeTime % 60));
                minutes = (minutes < 2) ? minutes += 'min' : minutes += ' mins';
                hours = (hours < 2) ? hours += ' hr' : hours += ' hrs';
                return hours + ' ' + minutes;
            }
        }
    },
    created: function () {
        this.activeType = this.searchTypes[0];
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
                          <li v-for="searchType in searchTypes" @click="setActiveType(searchType)" v-bind:title="searchType.type" class="sv-icon"
                            v-bind:class="{ 'sv-icon-active': activeType.type === searchType.type }">
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
                    <strong class="route-stats">{{ time }}</strong>
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