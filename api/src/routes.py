import secrets
from src.db import get_db
from flask import jsonify, request, session
from flask_httpauth import HTTPTokenAuth

def init_route(app):
    auth = HTTPTokenAuth()
    @auth.verify_token
    def verify_token(token):
        db = get_db()
        query = "SELECT * FROM user WHERE token = ?"
        user = db.execute(query, (token,)).fetchone()
        return user

    @app.route("/auth/login", methods=["POST"])
    def login():
        db = get_db()
        data = request.json
        email = data.get("email")
        #validate
        query = "SELECT id FROM user WHERE email = ?"
        user = db.execute(query, (email,)).fetchone()
        token = secrets.token_urlsafe(16)
        if user:
            query = "UPDATE user SET token = ? WHERE id=?"
            db.execute(
                query,
                (token, user["id"])
            )
            db.commit()
        else:
            timezone = 'Asia/Katmandu'
            query = "INSERT INTO user (email, timezone, token) VALUES (?, ?, ?)"
            db.execute(
                query,
                (email, timezone, token)
            )
            db.commit()
        
        return {
            "token": token
        }

    # Events
    @app.route("/api/events", methods=["GET"])
    @auth.login_required
    def get_events():
        db = get_db()
        user = auth.current_user()
        query = "SELECT * FROM event WHERE author_id = ?"
        res = db.execute(query, (user["id"],))
        lists = []
        for item in res.fetchall():   
            lists.append({
                "id": item["id"],
                "author_id": item["author_id"],
                "title": item["title"],
                "start_date_time": item["start_date_time"],
                "end_date_time": item["end_date_time"],
                "description": item["description"],
                "participants": item["participants"],
                "created": item["created"]
            })
        return jsonify(lists)

    @app.route("/api/events", methods=["POST"])
    @auth.login_required
    def create_event():
        db = get_db()
        user = auth.current_user()
        try:
            data = request.json

            title = data.get("title")
            start_date_time = data.get("start_date_time") # convert to timestamp from string
            end_date_time = data.get("end_date_time")
            description = data.get("description")
            participants = data.get("participants")

            # todo: validate
            query = "INSERT INTO event (author_id, title, start_date_time, end_date_time, description, participants) VALUES (?, ?, ?, ?, ?, ?)"
            db.execute(
                query,
                (user["id"], title, start_date_time, end_date_time, description, participants)
            )
            db.commit()

            return jsonify({
                "message": "Event created."
            })

        except Exception as e:
            db.rollback()
            return jsonify({
                "error": str(e)
            }), 500

    @app.route("/api/events/<int:id>", methods=['GET'])
    @auth.login_required
    def get_event(id):
        db = get_db()
        user = auth.current_user()

        query = "SELECT * FROM event WHERE author_id = ? and id = ?"
        item = db.execute(query, (user["id"], id)).fetchone()

        if item:
            return jsonify({
                "id": item["id"],
                "author_id": item["author_id"],
                "title": item["title"],
                "start_date_time": item["start_date_time"],
                "end_date_time": item["end_date_time"],
                "description": item["description"],
                "participants": item["participants"],
                "created": item["created"]
            })
        
        return jsonify({
            "error": "Not found"
        }), 404
    
    @app.route("/api/events/<int:id>", methods=['PUT'])
    @auth.login_required
    def udpate_event(id):
        db = get_db()
        user = auth.current_user()

        try:
            query = "SELECT * FROM event WHERE author_id = ? and id = ?"
            item = db.execute(query, (user["id"], id)).fetchone()

            if item:
                data = request.json

                title = data.get("title")
                start_date_time = data.get("start_date_time") # convert to timestamp from string
                end_date_time = data.get("end_date_time")
                description = data.get("description")
                participants = data.get("participants")

                #validate 

                update_query = "UPDATE event SET title = ?, start_date_time = ?, end_date_time = ?, description = ?, participants = ? WHERE id = ?"
                db.execute(update_query, (title, start_date_time, end_date_time, description, participants, id))
                db.commit()

                return jsonify({
                    "message": "Event updated."
                })
            
            return jsonify({
                "error": "Not found"
            }), 404
        
        except Exception as e:
            db.rollback()
            return jsonify({
                "error": str(e)
            }), 500
    
    @app.route("/api/events/<int:id>", methods=['DELETE'])
    @auth.login_required
    def delete_event(id):
        db = get_db()
        user = auth.current_user()
        try:
            query = "SELECT * FROM event WHERE author_id = ? and id = ?"
            item = db.execute(query, (user["id"], id)).fetchone()

            if item:
                update_query = "DELETE FROM event WHERE id = ?"
                db.execute(update_query, (id,))
                db.commit()

                return jsonify({
                    "message": "Event deleted."
                })
            
            return jsonify({
                "error": "Not found"
            }), 404
        
        except Exception as e:
            db.rollback()
            return jsonify({
                "error": str(e)
            }), 500

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404