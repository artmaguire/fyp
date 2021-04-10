from .utilities import *
from .resources import *
from flask import Flask
from flask_socketio import SocketIO
from whitenoise import WhiteNoise
from flask_restful import Api

socketio = SocketIO()
from .sockets import *


def create_app(debug=False):
    """Create an application."""
    app = Flask(__name__, static_url_path="")
    app.debug = debug

    app.wsgi_app = WhiteNoise(app.wsgi_app, root='public/', index_file=True)

    api = Api(app)

    api.add_resource(Route, '/route')

    socketio.init_app(app)

    return app
