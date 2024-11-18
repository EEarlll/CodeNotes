FROM python:3.11-alpine

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["waitress-serve", "--host=0.0.0.0" ,"--port=5000" ,"--call", "flaskr:create_app"]
