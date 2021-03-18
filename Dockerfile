FROM python:3.8.8-alpine
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
WORKDIR /app
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
COPY . .
RUN pip install -r requirements.txt
RUN pip install deps/dfosm*.whl
RUN mkdir -p /app/logs
EXPOSE 5000
CMD ["flask", "run"]
