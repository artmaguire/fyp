FROM python:3.8-alpine
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
WORKDIR /app
ENV FLASk_APP=app.py
COPY . .
RUN pip install -r requirements.txt
RUN pip install deps/dfosm*.whl
RUN mkdir -p /app/logs
EXPOSE 5000
CMD ["flask", "run"]
