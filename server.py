import sqlite3
from flask import Flask, render_template, g, current_app, jsonify, request
from flask.cli import with_appcontext
import click

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/boards', methods=['GET'])
def show_boards():
    boards = sqlquery('SELECT id, title FROM boards')
    cards = list(sqlquery('SELECT board_id, title FROM cards'))

    return jsonify([
        {
            'title': title,
            'cards': [title for board_id, title in cards if board_id == id]
        }
        for id, title in boards
    ])

@app.route('/boards', methods=['POST'])
def create_board():
    query = "insert into boards(title) values (?)"
    sqlexecute(query, (request.form.get('title'),))

    return jsonify({'status': 'success', 'params': {k:v for k,v in request.form.items()}})

@app.route('/boards/<int:board_id>/cards', methods=['POST'])
def create_card(board_id):
    query = "insert into cards(board_id, title) values (?, ?)"
    sqlexecute(query, board_id, request.form.get('title'))

    return jsonify({'status': 'success'})

@app.route('/cards/<int:id>', methods=['DELETE'])
def delete_card(id):
    query = "delete from cards where id = ?"
    sqlexecute(query, id)

class dbcursor:
    def __init__(self, connection):
        self._connection = connection
        self._cursor = None

    def __enter__(self):
        self._cursor = self._connection.cursor()
        return self._cursor

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self._cursor.close()

def dbconn():
    if 'db' not in g:
        g.db = sqlite3.connect(
            'database.sqlite3',
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
        g.db.set_trace_callback(print)
    return g.db

def sqlexecute(sql: str, args):
    with dbcursor(dbconn()) as cursor:
        cursor.execute(sql, tuple(args))
        dbconn().commit()

def sqlquery(sql: str, *args):
    cursor = dbconn().cursor()
    cursor.execute(sql, args)

    for result in cursor:
        yield result

    cursor.close()

@app.teardown_appcontext
def dbclose(_):
    db = g.pop('db', None)

    if db is not None:
        db.close()

def dbinit():
    db = dbconn()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@app.cli.add_command
@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    dbinit()
    click.echo('Initialized the database.')
