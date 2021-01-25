const main = new Vue({
    el: '#main-component',
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
    mounted() {
        setTimeout(() => {
            this.isSplashLoading = false;
        }, 1000)
    },
    template: `
    <div>
        <splash-screen :active="isSplashLoading"></splash-screen>
        <div v-bind:class="{ 'is-invisible': isSplashLoading }">
    
            <loading-screen v-bind:type="searchType" v-if="isLoading"></loading-screen>
    
            <div id="mapid"></div>
            <search @loading="startLoading"></search>
        </div>
    </div>`
});