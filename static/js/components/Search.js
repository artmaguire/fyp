let search = Vue.component('search', {
    data: function () {
        return {
            additionalNodes: [],
            activeType: 'driving'
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
            this.$emit('loading', this.activeType)
            displayRoute(this.additionalNodes.map(x => x.id));
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
                      <li @click="setActiveType('driving')" class="sv-icon" v-bind:class="{ 'sv-icon-active': activeType === 'driving' }">
                        <i class="fa fa-car"> </i>
                      </li>
                      <li @click="setActiveType('cycling')" class="sv-icon" v-bind:class="{ 'sv-icon-active': activeType === 'cycling' }">
                        <i class="fa fa-bicycle"></i>
                      </li>
                      <li @click="setActiveType('walking')" class="sv-icon" v-bind:class="{ 'sv-icon-active': activeType === 'walking' }">
                        <i class="fa fa-blind"></i>
                      </li>
                      <!-- TODO: Add more gifs for bus and truck? -->
                      <li @click="setActiveType('scenic')" class="sv-icon" v-bind:class="{ 'sv-icon-active': activeType === 'scenic' }">
                        <i class="fa fa-bus"></i>
                      </li>
                      <li @click="setActiveType('scenic')" class="sv-icon" v-bind:class="{ 'sv-icon-active': activeType === 'scenic' }">
                        <i class="fa fa-truck"></i>
                      </li>
                    </ul>
                </div>
            </div>
            <div class="sv-inputs">
                <!-- Templating for search nodes, done by Vue Component -->
                <node-search :id="0" :index="0"></node-search>
                <template v-for="(child, index) in additionalNodes">
                    <hr style="margin: 2px;">
                    <component :is="child.component" :id="child.id" :index="index+1"></component>
                </template>
                <hr style="margin: 2px;">

                <!-- Templating for search nodes, done by Vue Component -->
                <node-search :id="-1" :index="-1"></node-search>
            </div>
            <div id="checkbox-search-btn sv-container">
                <div class="sv-item">
                    <button class="button add-node" @click="addNode" :disabled="additionalNodes.length >= 5">
                        <i class="fa fa-plus"></i>
                    </button>
                    <div id="search-btn">
                        <button id="go-button" class="button is-rounded" @click="goButtonClick">
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