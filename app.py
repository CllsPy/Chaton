from flask import Flask, render_template
from flask_socketio import SocketIO
import random
import requests

app = Flask(__name__)
socketio = SocketIO(app)

users = {}

@socketio.on("connect")
def socket_event():
    prefix = "User_" 
    random_id = random.randint(1000, 9999)
    username = prefix + str(random_id)
    gender = random.choice(["boy", "girl"])
    avatar_url = requests.get(f"https://avatar.iran.liara.run/public/{gender}?username={username}")
    users["request.sid"] = username

@app.route("/")
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app)