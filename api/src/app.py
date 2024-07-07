from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['APP_DATE_TIME_FORMAT'] = '%Y-%m-%d %H:%M:%S'
app.config['APP_DATE_FORMAT'] = '%Y-%m-%d'
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)

import routes

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)

