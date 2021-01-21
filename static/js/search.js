const search = new Vue({
    el: '#search-view',
    data: {
        additionalNodes: []
    },
    methods: {
        addNode() {
            this.additionalNodes.push({id: Math.random(), component: nodeSearch});
        },
        goButtonClick: function () {
            displayRoute(this.additionalNodes.map(x => x.id));
        },
        handleBlur() {
            console.log('blur')
        }
    }
});

// Enum for start and node
const nodes = {
    START: 0,
    END: -1
};