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
def socket_event():
    prefix = "User_" 
    random_id = random.randint(1000, 9999)
    username = prefix + str(random_id)
    gender = random.choice(["boy", "girl"])
    avatar_url = f"https://i.pravatar.cc/150?u={username}"

    users[request.sid] = {"name": username, "avatar": avatar_url} 
    socketio.emit('user_joined', users[request.sid]);
    socketio.emit('set_username', users[request.sid]);

@socketio.on("send_message")
def display_user_msg(data): 
    req_id = request.sid #

    user_info = users[req_id]  
    username = user_info["name"]  
    avatar = user_info["avatar"]  

    print("🔊 send_message recebido!", req_id, data)


    if req_id in users:
        socketio.emit('new_message', {"name":username, "avatar":avatar, "msg":data});
        print("📤 Emitindo new_message para todos")


    else:
        return f"User {req_id} didn't exist"

    

@app.route("/")
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app)