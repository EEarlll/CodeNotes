import sqlite3

import click
from flask import current_app, g


def prGreen(skk):
    print("\033[92m {}\033[00m".format(skk))


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


def init_db(filename):
    db = get_db()
    prGreen(filename)

    with current_app.open_resource(filename) as f:
        db.executescript(f.read().decode("utf8"))


@click.command("init-db")
@click.argument("filename", default="schema.sql")
def init_db_command(filename):
    init_db(filename)
    click.echo("Initialized Database")


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"], detect_types=sqlite3.PARSE_DECLTYPES
        )

        g.db.row_factory = make_dicts

    return g.db


def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))


def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()
