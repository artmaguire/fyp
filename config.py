from decouple import config


class Config(object):
    HOST = config('HOST', default='0.0.0.0')
    PORT = config('PORT', default=5000, cast=int)
    DEBUG = config('DEBUG', default=False, cast=bool)

    DBNAME = config('DBNAME')
    DBUSER = config('DBUSER')
    DBPASSWORD = config('DBPASSWORD')
    DBHOST = config('DBHOST')
    DBPORT = config('DBPORT')


conf = Config()
