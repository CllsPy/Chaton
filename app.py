import random

from flask import Flask, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}


@socketio.on("connect")
def handle_connect():
    username = f"U{random.randint(1, 10)}"
    avatar = f"https://ui-avatars.com/api/?name={username}"

    users[request.sid] = {"username": username, "avatar": avatar}
    emit("new user", {"username": username, "avatar": avatar})
    emit("set_username", {"username": username})


@socketio.on("disconnect")
def handle_disconnect():
    user = users.pop(request.sid, None)

    if user:
        emit("user disconnected", {"username": user["username"]})


@socketio.on("send_message")
def handle_send_message(data):
    user = users[request.sid]

    if user:
        emit(
            "new message", {
                "username":user["username"], 
                "avatar":user["avatar"], 
                "message":data["message"]
            }
        )


@socketio.on("update_username")
def updater_user(data):
    req_id = request.sid
    old = users[req_id]["name"]
    new = users[req_id]["name"] = data

    socketio.emit("username_updated", {"old": old, "new": new})


@app.route("/")
def hello_world():
    return render_template("index.html")


if __name__ == "__main__":
    socketio.run(app)
