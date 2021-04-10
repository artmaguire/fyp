from app import create_app, conf, logger

app = create_app(conf.DEBUG)

if __name__ == '__main__':
    app.run(debug=conf.DEBUG, host=conf.HOST, port=conf.PORT)
    logger.info(f"Flask running at: {conf.HOST}:{conf.PORT} with debugging: {conf.DEBUG}")
