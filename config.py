from decouple import config


class Config(object):
    HOST = config('HOST', default='0.0.0.0')
    PORT = config('PORT', default=5000, cast=int)
    DEBUG = config('DEBUG', default=False, cast=bool)
    THREADS = config('THREADS', default=6, cast=int)

    DBNAME = config('DBNAME')
    DBUSER = config('DBUSER')
    DBPASSWORD = config('DBPASSWORD')
    DBHOST = config('DBHOST')
    DBPORT = config('DBPORT')

    EDGES_TABLE = config('EDGES_TABLE')
    VERTICES_TABLE = config('VERTICES_TABLE')

    LOCATIONIQ_API_KEY = config('LOCATIONIQ_API_KEY')


conf = Config()
