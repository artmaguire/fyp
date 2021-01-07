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
    cur.execute("SELECT * FROM osm_places WHERE name ILIKE %s LIMIT 10", (name,))
    return cur.fetchall()



def get_geo_name(name):
    name += '%'
    cur.execute("SELECT * FROM osm_places WHERE name ILIKE %s LIMIT 10", (name,))
    return cur.fetchall()
