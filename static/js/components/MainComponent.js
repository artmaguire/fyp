Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        nodes: new Map(),
        routeType: null
    },
    mutations: {
        SET_NODE(state, node) {
            state.nodes.set(node.id, node);
        },
        SET_ROUTE_LOADING(state, searchType) {
            state.routeType = searchType;
        },
        SET_NODE_MAP(state, nodeMap) {
            state.nodes = nodeMap;
        }
    },
    getters: {
        getNodes: state => {
            return state.nodes;
        },
        getRouteType: state => {
            return state.routeType;
        }
    }
})

const main = new Vue({
    el: '#main-component',
    store: store,
    data: {
        isSplashLoading: true,
        isLoading: false,
        searchType: 'driving'
    },
    methods: {
        startLoading(type) {
            console.log(type)
            this.searchType = type.type;
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false
            }, 1000);
        },

        allRoadLeadToLimerick() {
            // Change map to light map
            this.$store.commit('SET_ROUTE_LOADING', 'all_roads')
            setTimeout(() => {
                this.$store.commit('SET_ROUTE_LOADING', null);
            }, 3000);

            allRoads();
            changeMapToLight();
            console.log('paddy');
        }
    },
    computed: {
        routeType() {
            return this.$store.getters.getRouteType;
        }
    },
    mounted() {
        setTimeout(() => {
            this.isSplashLoading = false;
        }, 1000)
    },
    template: `
    <div>
        <splash-screen :active="isSplashLoading"></splash-screen>
        <div v-bind:class="{ 'is-invisible': isSplashLoading }">
    
            <loading-screen v-bind:type="routeType" v-if="routeType"></loading-screen>
    
            <div id="mapid"></div>
            <search @loading="startLoading"></search>

            <div class="box all-roads-limerick-button" @click="allRoadLeadToLimerick">
                <i class="all-roads-limerick-icon fas fa-road"></i>
            </div>
        </div>
    </div>`
});