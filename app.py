import logging

import requests
from dfosm import DFOSM
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit

from constants import Algorithms

from config import conf
import log_helper

logger = logging.getLogger('dfosm_server')

app = Flask(__name__)
socketio = SocketIO(app)

dfosm = DFOSM(conf.THREADS, conf.DBNAME, conf.DBUSER, conf.DBPASSWORD, conf.DBHOST, conf.DBPORT, conf.EDGES_TABLE,
              conf.VERTICES_TABLE)


@socketio.on('geoname_search')
def handle_geoname(data):
    logger.debug('********************   START SEARCH   ********************')
    logger.debug(str(data))

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

    logger.debug(str(result))
    logger.debug('********************   END   SEARCH   ********************')

    emit('geoname_result', result)


@app.route('/')
def home():
    return app.send_static_file('index.html')


# @app.route('/search', methods=['GET'])
# def search():
#     open_connection()
#     name = request.args.get('name')
#     results = get_location_name(name)
#     return jsonify(results)


@app.route('/route', methods=['GET'])
def route():
    logger.info('********************   START ROUTE   ********************')
    logger.info(request.args.get('source'))
    logger.info(request.args.get('target'))
    logger.info('Algorithm: ' + request.args.get('algorithmType'))
    logger.info('Visualisation: ' + request.args.get('visualisation'))

    source_lat, source_lng = request.args.get('source').split(',')
    target_lat, target_lng = request.args.get('target').split(',')
    algorithmType = int(request.args.get('algorithmType'))
    visualisation = bool(int(request.args.get('visualisation')))

    if algorithmType == Algorithms.DIJKSTRA.value:
        fn = dfosm.dijkstra
    elif algorithmType == Algorithms.BI_DIJKSTRA.value:
        fn = dfosm.bi_dijkstra
    elif algorithmType == Algorithms.ASTAR.value:
        fn = dfosm.a_star
    elif algorithmType == Algorithms.BI_ASTAR.value:
        fn = dfosm.bi_a_star
    else:
        fn = dfosm.a_star

    result = fn(float(source_lat), float(source_lng), float(target_lat), float(target_lng),
                visualisation=visualisation,
                history=False)

    logger.info('********************   END   ROUTE   ********************')

    return jsonify(result)


if __name__ == '__main__':
    app.debug = conf.DEBUG
    app.run(debug=conf.DEBUG, host=conf.HOST, port=conf.PORT)
    logger.info(f"Flask running at: {conf.HOST}:{conf.PORT} with debugging: {conf.DEBUG}")
