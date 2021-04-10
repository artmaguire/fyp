import concurrent.futures
import json
import logging

from dfosm import DFOSM
from flask import jsonify
from flask_restful import Resource, reqparse, inputs
from werkzeug.exceptions import BadRequest

from app.utilities.config import conf
from app.utilities.constants import Algorithms

logger = logging.getLogger('dfosm_server')

dfosm = DFOSM(threads=conf.THREADS, timeout=conf.TIMEOUT, dbname=conf.DBNAME, dbuser=conf.DBUSER,
              dbpassword=conf.DBPASSWORD, dbhost=conf.DBHOST, dbport=conf.DBPORT, edges_table=conf.EDGES_TABLE,
              vertices_table=conf.VERTICES_TABLE)


class Route(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('source', required=True)
        self.parser.add_argument('target', required=True)
        self.parser.add_argument('additionalNodes', default="[]")
        self.parser.add_argument('algorithmType', type=int, default=Algorithms.BI_ASTAR.value)
        self.parser.add_argument('flag', type=int, choices=(1, 2, 4), default=1)
        self.parser.add_argument('visualisation', type=inputs.boolean, default=False)
        self.parser.add_argument('history', type=inputs.boolean, default=False)

    def get(self):
        logger.info('********************   START ROUTE   ********************')
        args = self.parser.parse_args()
        print(args)

        try:
            source = json.loads(args.source)
        except json.decoder.JSONDecodeError:
            logger.error(f"source: {args.source} is not valid JSON.")
            raise BadRequest(f"source: {args.source} is not valid JSON.")
        try:
            target = json.loads(args.target)
        except json.decoder.JSONDecodeError:
            logger.error(f"target: {args.target} is not valid JSON.")
            raise BadRequest(f"target: {args.target} is not valid JSON.")
        try:
            additional_nodes = json.loads(args.additionalNodes)
        except json.decoder.JSONDecodeError:
            logger.error(f"additionalNodes: {args.additionalNodes} is not valid JSON.")
            raise BadRequest(f"additionalNodes: {args.additionalNodes} is not valid JSON.")

        try:
            nodes = [(float(source["lat"]), float(source["lng"]))]
            for node in additional_nodes:
                nodes.append((float(node["lat"]), float(node["lng"])))
            nodes.append((float(target["lat"]), float(target["lng"])))
        except KeyError:
            logger.error(f"additionalNode: {additional_nodes} missing lat / lng.")
            raise BadRequest(f"additionalNode: {additional_nodes} missing lat / lng.")

        logger.info(f'Algorithm: {args.algorithmType}')
        logger.info(f'Visualisation: {args.visualisation}')
        logger.info(f'Nodes: {str(nodes)}')

        if args.algorithmType == Algorithms.DIJKSTRA.value:
            fn = dfosm.dijkstra
        elif args.algorithmType == Algorithms.BI_DIJKSTRA.value:
            fn = dfosm.bi_dijkstra
        elif args.algorithmType == Algorithms.ASTAR.value:
            fn = dfosm.a_star
        elif args.algorithmType == Algorithms.BI_ASTAR.value:
            fn = dfosm.bi_a_star
        else:
            fn = dfosm.a_star

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_results = []

            for i in range(len(nodes) - 1):
                source = nodes[i]
                target = nodes[i + 1]
                future_results.append(
                    executor.submit(fn, source[0], source[1], target[0], target[1], args.flag, args.visualisation,
                                    args.history))

        logger.info('********************   END   ROUTE   ********************')

        return jsonify([f.result() for f in future_results])
