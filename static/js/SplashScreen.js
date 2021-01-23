// Controls the Splash Screen when the website is entered
const splash = new Vue({
    el: '#splash-screen',
    data: {
        isActive: true
    },
    mounted() {
        setTimeout(() => {
            this.isActive = false;
            document.getElementById("main-component").className = '';
        }, 1000)
    }
});