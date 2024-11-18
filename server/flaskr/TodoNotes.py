from flask import Blueprint, request, jsonify
from datetime import datetime
from flaskr.db import get_db
from flaskr.auth import requires_auth

bp = Blueprint("Notes", __name__, url_prefix="/api/Notes")


def prGreen(skk):
    print("\033[92m {}\033[00m".format(skk))


@bp.route("/", methods=["GET"])
@bp.route("/category/", methods=["GET"])
@bp.route("/category/All/<string:category>/", methods=["GET"])
@bp.route("/category/<string:user>/", methods=["GET"])
@bp.route("/category/<string:user>/<string:category>/", methods=["GET"])
def index(category=None, user=None):
    db = get_db()
    offset = request.args.get("offset") if request.args.get("offset") else "0"
    limit = request.args.get("limit") if request.args.get("limit") else "25"
    search = request.args.get("search") if request.args.get("search") else ""
    param = []
    condition = ""

    if category and user:
        param = [category, user]
        condition = "WHERE category = ? AND user = ?"
    elif category:
        param = [category]
        condition = "WHERE category = ?"
    elif user:
        param = [user]
        condition = "WHERE user = ?"
    if search:
        condition += f"{'AND' if condition else 'WHERE'} title LIKE ? "
        param.append("%" + search + "%")
    # prGreen(
    #     f"SELECT * FROM tdn_Notes {condition} ORDER BY DateCreated DESC LIMIT {limit} OFFSET {offset}"
    # )
    notes = db.execute(
        f"SELECT * FROM tdn_Notes {condition} ORDER BY DateCreated DESC LIMIT {limit} OFFSET {offset}",
        param,
    ).fetchall()

    return jsonify(notes), 200


@bp.route("/categorylist/", methods=["GET"])
@bp.route("/categorylist/<string:user>", methods=["GET"])
def getCategory(user=None):
    db = get_db()
    category = db.execute(
        f"SELECT * FROM tdn_Categories {'WHERE user = ?' if user else ''} ORDER BY DateCreated DESC LIMIT 50",
        [user] if user else [],
    ).fetchall()

    return jsonify(category), 200


@bp.route("/pinnedNotes/", methods=["GET"])
@requires_auth
def getPinnedNotes():
    db = get_db()
    pinnedNotes = db.execute(
        f"SELECT n.* From tdn_Notes n JOIN tdn_Pins P on n.id = p.note_id WHERE p.uid = ?",
        [request.uid],
    ).fetchall()

    return jsonify(pinnedNotes), 200


@bp.route("/<int:id>/pin", methods=["POST"])
@requires_auth
def pinNote(id=None):
    db = get_db()
    if request.method == "POST":
        content = request.json

        if request.uid == "guest":
            return jsonify({"Authentication": "Pinned note locally"}), 400

        sql = "INSERT INTO tdn_Pins(uid, user, note_id) VALUES(?, ?, ?)"

        param = [request.uid, content["user"], id]
        db.execute(sql, param)
        db.commit()

        return jsonify("Pinned note"), 200


@bp.route("/create", methods=["POST"])
@bp.route("/create/category/<string:category>", methods=["POST"])
@requires_auth
def postNote(category=None):
    db = get_db()

    if request.method == "POST":
        content = request.json

        if not category and (
            not content["title"]
            or not content["category"]
            or not content["message"]
            or not content["format"]
            or not content["user"]
        ):
            return jsonify({"Error": "all inputs are required"}), 400

        if category and check_record("title", "tdn_Categories", category):
            return jsonify({"Error": "Duplicate Item found"}), 400

        curr_date = str(datetime.now())

        sqlNote = (
            "INSERT INTO tdn_Categories(title, user, DateCreated, uid) VALUES(?,?,?,?)"
            if category
            else "INSERT INTO tdn_Notes(title, user, category, message, DateCreated, format, uid) VALUES(?, ?, ?, ?, ?, ?, ?);"
        )

        paramNote = (
            [category, content["user"], curr_date, request.uid]
            if category
            else [
                content["title"],
                content["user"],
                content["category"],
                content["message"],
                curr_date,
                content["format"],
                request.uid,
            ]
        )

        db.execute(sqlNote, paramNote)
        db.commit()

        return jsonify("Successfully posted new item"), 200


@bp.route("/<int:id>/update", methods=["POST", "PUT"])
@requires_auth
def update(id):
    note = check_record("id", "tdn_Notes", id)
    db = get_db()
    content = request.json
    uid = request.uid

    if request.method == "POST" and note:
        db.execute(
            "UPDATE tdn_Notes Set title = ?, message = ?, DateCreated = ? WHERE uid = ? and id = ?",
            [
                content["title"],
                content["message"],
                str(datetime.now()),
                uid,
                id,
            ],
        )

        db.commit()

        return jsonify("Successfully updated new note"), 200

    return jsonify("No id found"), 400


@bp.route("/<int:id>/delete/", methods=["DELETE"])
@bp.route("/<int:id>/delete/<string:category>", methods=["DELETE"])
@requires_auth
def delete(id, category=None):

    if request.method == "DELETE":
        db = get_db()

        if (not category and not check_record("id", "tdn_Notes", id)) or (
            category and not check_record("title", "tdn_Categories", category)
        ):
            return jsonify("No id found"), 400

        sql = (
            "DELETE FROM tdn_Categories WHERE title = ? AND uid = ?"
            if category
            else "DELETE FROM tdn_Notes WHERE id = ? AND uid = ?"
        )

        param = [category, request.uid] if category else [id, request.uid]

        db.execute(sql, param)
        db.commit()
        return jsonify("Successfully deleted item"), 200


@bp.route("/<int:id>/pin", methods=["DELETE"])
@requires_auth
def unPinNote(id=None):

    if request.method == "DELETE":
        db = get_db()

        if not check_record("note_id", "tdn_Pins", id):
            return jsonify("No id found"), 400

        sql = "DELETE FROM tdn_Pins WHERE note_id = ? and uid = ?"
        param = [id, request.uid]

        db.execute(sql, param)
        db.commit()

        return jsonify("Unpinned Item"), 200


def check_record(id, table, val):
    item = (
        get_db().execute(f"SELECT COUNT(*) AS count FROM {table} WHERE {id} = ?", [val])
    ).fetchone()

    if item["count"] <= 0:
        return False

    return True
