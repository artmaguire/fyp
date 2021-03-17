import logging
import sys

log = logging.getLogger('werkzeug')
# log.setLevel(logging.ERROR)
fh = logging.FileHandler('logs/flask.log')
fh.setLevel(logging.DEBUG)
log.addHandler(fh)

logger = logging.getLogger('dfosm_server')
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler('logs/dfosm.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
fh.setLevel(logging.DEBUG)
logger.addHandler(fh)

sh = logging.StreamHandler(sys.stdout)
sh.setLevel(logging.INFO)
logger.addHandler(sh)
