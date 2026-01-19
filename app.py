from flask import Flask, render_template
from flask_socketio import SocketIO
from flask import request
import random

app = Flask(__name__)
socketio = SocketIO(app)

users = {}

@socketio.on("connect")
def socket_event():
    prefix = "User_" 
    random_id = random.randint(1000, 9999)
    username = prefix + str(random_id)
    gender = random.choice(["boy", "girl"])
    avatar_url = f"https://avatar.iran.liara.run/public/{gender}?username={username}"
    users[request.sid] = {"name": username, "avatar": avatar_url} 
    socketio.emit('user_joined', users[request.sid], broadcast=True);
    socketio.emit('set_username', users[request.sid]);
    

@app.route("/")
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app)