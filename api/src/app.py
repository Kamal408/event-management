from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_apscheduler import APScheduler
from flask_cors import CORS

app = Flask(__name__)
scheduler = APScheduler()

CORS(app)

import json
app.config.from_file("../config.json", load=json.load)

db = SQLAlchemy(app)

import routes

with app.app_context():
    db.create_all()

scheduler.init_app(app)
scheduler.start()

if __name__ == "__main__":
    app.run(debug=False)

