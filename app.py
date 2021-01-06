from flask import Flask, jsonify, request
from postgres_helper import get_location_name, open_connection, close_connection

app = Flask(__name__)


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
