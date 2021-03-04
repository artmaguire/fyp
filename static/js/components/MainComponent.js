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
        </div>
    </div>`
});