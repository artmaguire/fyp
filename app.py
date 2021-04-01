import json
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

dfosm = DFOSM(threads=conf.THREADS, timeout=conf.TIMEOUT, dbname=conf.DBNAME, dbuser=conf.DBUSER,
              dbpassword=conf.DBPASSWORD, dbhost=conf.DBHOST, dbport=conf.DBPORT, edges_table=conf.EDGES_TABLE,
              vertices_table=conf.VERTICES_TABLE)


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

    source = request.args.get('source').split(',') if request.args.get('source') != '' else []
    target = request.args.get('target').split(',') if request.args.get('target') != '' else []
    via1 = request.args.get('via1').split(',') if request.args.get('via1') != '' else []
    via2 = request.args.get('via2').split(',') if request.args.get('via2') != '' else []
    via3 = request.args.get('via3').split(',') if request.args.get('via3') != '' else []
    via4 = request.args.get('via4').split(',') if request.args.get('via4') != '' else []
    via5 = request.args.get('via5').split(',') if request.args.get('via5') != '' else []

    nodes = {
        0:  [float(source[0]), float(source[1])] if source != [] else source,
        1:  [float(via1[0]), float(via1[1])] if via1 != [] else via1,
        2:  [float(via2[0]), float(via2[1])] if via2 != [] else via2,
        3:  [float(via3[0]), float(via3[1])] if via3 != [] else via3,
        4:  [float(via4[0]), float(via4[1])] if via4 != [] else via4,
        5:  [float(via5[0]), float(via5[1])] if via5 != [] else via5,
        -1: [float(target[0]), float(target[1])] if target != [] else target
    }

    # Removes empty values in dict
    nodes = {k: v for k, v in nodes.items() if v}

    logger.info('Algorithm: ' + request.args.get('algorithmType'))
    logger.info('Visualisation: ' + request.args.get('visualisation'))
    logger.info('Nodes: ' + str(nodes))

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

    results_list = []

    for i in range(len(nodes)):
        if i not in nodes:
            break

        source = nodes[i]
        target = nodes[i + 1] if i + 1 in nodes else nodes[-1]

        algorithm_result = fn(source[0], source[1], target[0], target[1], visualisation=visualisation, history=False)
        algorithm_result['source_point'] = {'lat': source[0], 'lng': source[1]}
        algorithm_result['target_point'] = {'lat': target[0], 'lng': target[1]}

        results_list.append(algorithm_result)

    logger.info('********************   END   ROUTE   ********************')

    return jsonify(results_list)


if __name__ == '__main__':
    app.debug = conf.DEBUG
    app.run(debug=conf.DEBUG, host=conf.HOST, port=conf.PORT)
    logger.info(f"Flask running at: {conf.HOST}:{conf.PORT} with debugging: {conf.DEBUG}")
