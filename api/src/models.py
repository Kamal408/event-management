from app import db, app

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    start_date_time = db.Column(db.DateTime, nullable=False)
    end_date_time = db.Column(db.DateTime, nullable=False)
    participants = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    last_notified = db.Column(db.DateTime, nullable=True)

    def get_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "startDateTime": self.start_date_time.strftime(app.config["APP_DATE_TIME_FORMAT"]),
            "endDateTime": self.end_date_time.strftime(app.config["APP_DATE_TIME_FORMAT"]),
            "participants": self.participants,
            "description": self.description,
            "last_notified": self.last_notified
        }