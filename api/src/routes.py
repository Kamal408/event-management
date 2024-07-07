from app import app, db
from flask import jsonify, request
from models import Event
from datetime import datetime
from validate import (
    isValidDateTimeFormat,
    isValidDateFormat,
    getStartAndEndDateForMonth,
)

@app.route("/api/events", methods=["GET"])
def get_events():

    query = Event.query

    if request.args.get("date") and isValidDateFormat(request.args.get("date")):
        start, end = getStartAndEndDateForMonth(request.args.get("date"))
        query = query.filter(Event.start_date_time.between(start, end))

    events = query.all()

    results = {}
    for event in events:
        # start_date = datetime.fromtimestamp(event.start_date_time).strftime(app.config["APP_DATE_FORMAT"])
        start_date = event.start_date_time.strftime(app.config["APP_DATE_FORMAT"])
        # start_date = datetime.strptime(event.start_date_time, app.config["APP_DATE_TIME_FORMAT"]).strftime(app.config["APP_DATE_FORMAT"])

        if start_date in results:
            results[start_date].append(event.get_json())
        else:
            results[start_date] = [event.get_json()]

    return jsonify(results)


@app.route("/api/events/<int:id>", methods=["GET"])
def get_event(id):
    event = Event.query.get(id)

    if event is None:
        return jsonify({"message": "Not found"}), 404

    return jsonify(event.get_json())


@app.route("/api/events", methods=["POST"])
def create_event():

    try:
        data = request.json

        error = []

        for field in ["title", "startDateTime", "endDateTime", "participants"]:
            if field not in data:
                error.append(f"{field} is required")

            elif field == "startDateTime" or field == "endDateTime":
                if not isValidDateTimeFormat(data.get(field)):
                    error.append(f"{field} format is YYYY/MM/DD HH:MM:SS")

        if len(error) > 0:
            return jsonify({"message": error}), 400

        start_date_time = datetime.strptime(
            data.get("startDateTime"), app.config["APP_DATE_TIME_FORMAT"]
        )
        end_date_time = datetime.strptime(
            data.get("endDateTime"), app.config["APP_DATE_TIME_FORMAT"]
        )

        if end_date_time < start_date_time:
            return (
                jsonify({"message": "Start should be greater than End date time"}),
                400,
            )

        title = data.get("title")
        description = data.get("description")
        participants = data.get("participants")

        event = Event(
            title=title,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            description=description,
            participants=participants,
        )
        db.session.add(event)
        db.session.commit()

        return jsonify(event.get_json())

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:id>", methods=["PUT"])
def udpate_event(id):
    try:
        event = Event.query.get(id)

        if event is None:
            return jsonify({"error": "Not found"}), 404

        data = request.json

        event.title = data.get("title", event.title)
        event.description = data.get("description", event.description)
        event.participants = data.get("participants", event.participants)

        if data.get("startDateTime"):
            event.start_date_time = datetime.strptime(
                data.get("startDateTime"), app.config["APP_DATE_TIME_FORMAT"]
            )

        if data.get("endDateTime"):
            event.end_date_time = datetime.strptime(
                data.get("endDateTime"), app.config["APP_DATE_TIME_FORMAT"]
            )

        error = []
        if not isValidDateTimeFormat(event.start_date_time):
            error.append(f"startDateTime format is YYYY/MM/DD HH:MM:SS")

        if not isValidDateTimeFormat(event.end_date_time):
            error.append(f"endDateTime format is YYYY/MM/DD HH:MM:SS")

        if len(error) > 0:
            return jsonify({"message": error}), 400

        if event.end_date_time < event.start_date_time:
            return (
                jsonify({"message": "Start should be greater than End date time"}),
                400,
            )

        db.session.commit()

        return jsonify(event.get_json())

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:id>", methods=["DELETE"])
def delete_event(id):
    try:
        event = Event.query.get(id)
        if event is None:
            return jsonify({"message": "Not found"}), 404

        db.session.delete(event)
        db.session.commit()

        return jsonify({"message": "Event deleted."})

    except Exception as e:
        db.rollback()
        return jsonify({"message": str(e)}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({"message": "Not found"}), 404
