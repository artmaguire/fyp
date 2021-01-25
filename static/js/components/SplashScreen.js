// Controls the Splash Screen when the website is entered
let splashScreen = Vue.component('splash-screen', {
    props: {active: Boolean},
    template: `
        <div id="splash-screen" v-bind:class="{ 'is-active': active }" class="pageloader is-left-to-right">
            <span class="title has-text-weight-semibold">Direction Finding Using OpenStreetMap</span>
        </div>`
});