#!/bin/bash

# crontab -e : 0 0 * * 0 ~/CodeNotes/docker/bak.sh
SOURCE = "server/instance/flaskr.sqlite"
BACKUP_DIR = "server/backup"
BACKUP_NAME = "flaskr_bak.sqlite"

cp "$SOURCE" "$BACKUP_DIR/$BACKUP_NAME"

echo "Backup Created at $BACKUP_DIR/$BACKUP_NAME"