import requests, json
from flask import Flask, jsonify, request
from postgres_helper import get_location_name, open_connection, close_connection
from flask_socketio import SocketIO, send, emit
import logging

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app)

open_connection()


@socketio.on('geoname_search')
def handle_geoname(data):
    print(data)
    geonames = get_location_name(data.get('query'))
    print(geonames)
    result = {"node": data.get("node"), "geonames": geonames}
    emit('geoname_result', result)


@app.route('/')
def home():
    return app.send_static_file('index.html')


@app.route('/search', methods=['GET'])
def search():
    open_connection()
    name = request.args.get('name')
    results = get_location_name(name)
    print(name)
    print(results)

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
    socketio.run(app)
