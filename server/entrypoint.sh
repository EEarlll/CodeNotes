#!/bin/sh

if [ ! -f "/app/instance/flaskr.sqlite" ]; then
    echo "Database not found. Initializing database..."
    flask --app flaskr init-db
else
    echo "Database already exists. Skipping initialization."
fi

exec "$@"