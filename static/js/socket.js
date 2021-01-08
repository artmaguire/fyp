// Websocket to communicate with Flask, for searching geonames
const socket = io();
Vue.use(VueSocketIOExt, socket);