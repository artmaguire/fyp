import logging

import requests
from dfosm import DFOSM
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit

from config import conf
from postgres_helper import get_location_name, open_connection

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app)

print(conf.HOST)

# open_connection()

dfosm = DFOSM(conf.DBNAME, conf.DBUSER, conf.DBPASSWORD, conf.DBHOST, conf.DBPORT, conf.EDGES_TABLE,
              conf.VERTICES_TABLE)


@socketio.on('geoname_search')
def handle_geoname(data):
    query = "https://eu1.locationiq.com/v1/autocomplete.php"

    params = {
        'q':            data.get('query'),
        'key':          conf.LOCATIONIQ_API_KEY,
        'format':       'json',
        'limit':        5,
        'viewbox':      data.get('bounds'),
        'bounded':      0,
        'countrycodes': 'ie',
        'dedupe':       1
    }

    res = requests.get(query, params)
    result = {"node": data.get("node"), "geonames": res.json()}
    emit('geoname_result', result)


@app.route('/')
def home():
    return app.send_static_file('index.html')


@app.route('/search', methods=['GET'])
def search():
    open_connection()
    name = request.args.get('name')
    results = get_location_name(name)
    return jsonify(results)


@app.route('/route', methods=['GET'])
def route():
    source = request.args.get('source')
    target = request.args.get('target')

    print('Source: ', source, '\tTarget: ', target)

    nodes = dfosm.a_star(int(source), int(target))
    print(nodes)

    return jsonify(nodes)


if __name__ == '__main__':
    app.debug = True
    app.run()
    app.run(debug=conf.DEBUG, host=conf.HOST, port=conf.PORT)
    socketio.run(app)
