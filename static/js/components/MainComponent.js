Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        nodes: new Map(),
        routeLoading: false
    },
    mutations: {
        SET_NODE(state, node) {
            state.nodes.set(node.id, node);
        },
        SET_ROUTE_LOADING(state, loading) {
            state.routeLoading = loading;
        },
        SET_NODE_MAP(state, nodeMap) {
            state.nodes = nodeMap;
        }
    },
    getters: {
        getNodes: state => {
            return state.nodes;
        },
        isRouteLoading: state => {
            return state.routeLoading;
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
            this.searchType = type;
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false
            }, 1000);
        },

        allRoadLeadToLimerick() {
            // Change map to light map
            changeMapToLight();
            console.log('paddy');
        }
    },
    computed: {
        routeLoading() {
            return this.$store.getters.isRouteLoading;
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
    
            <loading-screen v-bind:type="searchType" v-if="routeLoading"></loading-screen>
    
            <div id="mapid"></div>
            <search @loading="startLoading"></search>


            <div class="box all-roads-limerick-button" @click="allRoadLeadToLimerick">
                <i class="all-roads-limerick-icon fas fa-road"></i>
            </div>
        </div>
    </div>`
});