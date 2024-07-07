from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_apscheduler import APScheduler
from flask_cors import CORS

app = Flask(__name__)
scheduler = APScheduler()

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['APP_DATE_TIME_FORMAT'] = '%Y-%m-%d %H:%M:%S'
app.config['APP_DATE_FORMAT'] = '%Y-%m-%d'

db = SQLAlchemy(app)

import routes

with app.app_context():
    db.create_all()

scheduler.init_app(app)
scheduler.start()

if __name__ == "__main__":
    app.run(debug=False)

