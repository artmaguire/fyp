import requests, json
from flask import Flask, jsonify, request
from postgres_helper import get_location_name, get_geo_name, open_connection, close_connection
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app)


@socketio.on('geoname_search')
def handle_geoname(data):
    params = {'maxRows': '5', 'username': 'aosm', 'name_startsWith': data.get('data')}
    r = requests.get('http://api.geonames.org/searchJSON', params=params)
    print(r.json())
    emit('geoname_result', 'message')


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
    app.run()
    socketio.run(app)
