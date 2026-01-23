import random

from flask import Flask, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}


@socketio.on("connect")
def handle_connect():
    username = f"U{random.randint(1, 9999)}"
    avatar = f"https://ui-avatars.com/api/?name={username}"

    users[request.sid] = {"username": username, "avatar": avatar}
    emit("user_joined", {"username": username, "avatar": avatar},  broadcast=True)
    emit("set_username", {"username": username})


@socketio.on("disconnect")
def handle_disconnect():
    user = users.pop(request.sid, None)

    if user:
        emit("user_disconnected", {"username": user["username"]}, broadcast=True)


@socketio.on("send_message")
def handle_send_message(data):
    user = users[request.sid]

    if user:
        emit(
            "new_message",
            {
                "username": user["username"],
                "avatar": user["avatar"],
                "message": data["message"]
            }, broadcast=True
        )


@socketio.on("update_username")
def handle_update_username(data):
    user = users[request.sid]
    old_username = user["username"]
    new_username = data["username"]
    user["username"] = new_username

    emit("username_updated", {"old": old_username, "new": new_username}, broadcast=True)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    socketio.run(app)
