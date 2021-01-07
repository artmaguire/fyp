import psycopg2


def open_connection():
    global conn, cur
    conn = psycopg2.connect(dbname="postgis", user="postgis", password="postgis", host="192.168.0.30", port="5432")
    cur = conn.cursor()


def close_connection():
    cur.close()
    conn.close()


def get_location_name(name):
    name += '%'
    cur.execute("SELECT osm_id, name, ST_Y(st_transform(geometry, 4674)), ST_X(st_transform(geometry, 4674)) FROM osm_places WHERE name ILIKE %s ORDER BY name LIMIT 10", (name,))
    result = cur.fetchall()
    print(result)
    list_result = [{'osm_id': t[0], 'name': t[1], 'lat': t[2], 'lon': t[3]} for t in result]
    return list_result
