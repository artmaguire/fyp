// Create a Vue Component for the node searching and dropdown lost of search results
// This can be reused for all node searches
// Templating for searching
let loadingScreen = Vue.component('loading-screen', {
    data: function () {
        return {
            loadingTitle: 'Finding Route...'
        }
    },
    methods: {
        cancelRoute() {
            // Reloads the site
            window.location.reload(true);
        }
    },
    props: {type: String},
    template: `<div id="loading-background">
        <div class="container-loading">
            <div class="finding-route-card">
                <!-- The loader will be here -->
                <button class="button cancel-route" title="Cancel route" @click="cancelRoute">
                    <i class="fa fa-times-circle"></i>
                </button>
                <h2 v-if="type === 'all_roads'" class="finding-route-text">
                    'All Roads Lead to Limerick'
                </h2>
                <h2 v-else class="finding-route-text">
                    {{ loadingTitle }}
                </h2>

                <div v-bind:class="[ type === 'walking' ? 'walking-gif' : 'gifs' ]" class="">
                    <img id="driving-gif"
                         v-bind:src="'/static/images/gifs/' + type + '.gif'">
                </div>
            </div>
        </div>
    </div>`
})