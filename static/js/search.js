const search = new Vue({
    el: '#search-view',
    data: {
        additionalNodes: []
    },
    methods: {
        addNode() {
            this.additionalNodes.push(nodeSearch);
        },
        goButtonClick: function () {
            displayRoute();
        }
    }
});

// Enum for start and node
const nodes = {
    START: 0,
    END: 1
};