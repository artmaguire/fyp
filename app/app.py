import requests
from flask import Flask
from flask_restful import Api
from flask_socketio import SocketIO, emit

from .utilities.config import conf
from .utilities.log_helper import logger
from .resources import Route

app = Flask(__name__, static_url_path="", static_folder="public")
api = Api(app)
socketio = SocketIO(app)

api.add_resource(Route, '/route')


@socketio.on('geoname_search')
def handle_geoname(data):
    logger.debug('********************   START SEARCH   ********************')
    logger.debug(str(data))

    query = "https://eu1.locationiq.com/v1/autocomplete.php"

    params = {
        'q': data.get('query'),
        'key': conf.LOCATIONIQ_API_KEY,
        'format': 'json',
        'limit': 5,
        'viewbox': data.get('bounds'),
        'bounded': 0,
        'countrycodes': 'ie',
        'dedupe': 1
    }

    res = requests.get(query, params)
    result = {"node": data.get("node"), "geonames": res.json()}

    logger.debug(str(result))
    logger.debug('********************   END   SEARCH   ********************')

    emit('geoname_result', result)


@socketio.on('reverse_geoname_search')
def handle_reverse_geoname(data):
    logger.debug('********************   START SEARCH   ********************')
    logger.debug(str(data))

    query = "https://us1.locationiq.com/v1/reverse.php"

    params = {
        'lat': data.get('lat'),
        'lon': data.get('lon'),
        'key': conf.LOCATIONIQ_API_KEY,
        'format': 'json',
        'limit': 3
    }

    res = requests.get(query, params)
    result = {"action": data.get("action"), "geoname": res.json()}
    result["geoname"]["display_place"] = result["geoname"]["display_name"].split(',')[0]

    logger.debug(str(result))
    logger.debug('********************   END   SEARCH   ********************')

    emit('reverse_geoname_result', result)


@app.route('/')
def home():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.debug = conf.DEBUG
    app.run(debug=conf.DEBUG, host=conf.HOST, port=conf.PORT)
    logger.info(f"Flask running at: {conf.HOST}:{conf.PORT} with debugging: {conf.DEBUG}")
