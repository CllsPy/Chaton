from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask import request
import random
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}

@socketio.on("connect")
def handle_connect():
    username = f"U{random.randint(1, 10)}"
    avatar = f"https://ui-avatars.com/api/?name={username}"

    users[request.sid] = {"username":username, "avatar":avatar}
    emit("user joined", {"username":username, "avatar":avatar})

@socketio.on("disconnect")
def handle_disconnect():
    user_removed = users.pop(request.sid, None)
@socketio.on("send_message")
def display_user_msg(data): 
    req_id = request.sid 

    user_info = users[req_id]  
    username = user_info["name"]  
    avatar = user_info["avatar"]  


    if req_id in users:
        socketio.emit('new_message', {"name":username, "avatar":avatar, "msg":data});
    

    else:
        return f"User {req_id} didn't exist"

@socketio.on("update_username")
def updater_user(data):
    req_id = request.sid 
    old = users[req_id]["name"]
    new = users[req_id]["name"] = data

    socketio.emit('username_updated',  {"old":old, "new": new});

  
@app.route("/")
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app)