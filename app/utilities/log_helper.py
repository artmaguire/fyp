import logging
import os
import pathlib
import sys

ROOT_DIR = os.path.abspath(os.curdir)
pathlib.Path(ROOT_DIR + "/logs").mkdir(parents=True, exist_ok=True)


flask_logger = logging.getLogger('werkzeug')
flask_logger.setLevel(logging.ERROR)
fh = logging.FileHandler(ROOT_DIR + '/logs/flask.log')
fh.setLevel(logging.DEBUG)
flask_logger.addHandler(fh)

dfosm_logger = logging.getLogger('dfosm')
dfosm_logger.setLevel(logging.DEBUG)
fh = logging.FileHandler(ROOT_DIR + '/logs/dfosm-star.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
fh.setLevel(logging.DEBUG)
dfosm_logger.addHandler(fh)

logger = logging.getLogger('dfosm_server')
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler(ROOT_DIR + '/logs/dfosm.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
fh.setLevel(logging.DEBUG)
logger.addHandler(fh)

sh = logging.StreamHandler(sys.stdout)
sh.setLevel(logging.INFO)
logger.addHandler(sh)
