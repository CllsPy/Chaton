const socket = io();

let currentUsername = "";

currentUsernameSpan = document.getElementById("current-username");

// listen set username
socket.on("set_username", (data) => {
  currentUsername = data.username;
  currentUsernameSpan.textContent = currentUsername;
});

// listen user joined
socket.on("user_joined", (data) => {
  addMessage(f`${data.username} joined the chat`, "system");
});

// liste to user left
socket.on("user_left", (data) => {
  addMessage(f`${data.username} left the chat`, "system");
});

// listen to message
socket.on("send_message", (data) => {
  addMessage(f`${data.message}`, "user", data.username, data.avatar);
});

// liste to update name
socket.on("send_message", (data) => {
  addMessage(
    f`User ${data.old_username} update his name to ${data.new_username}`,
    "system",
    data.username,
  );
});

// function addMessage
function addMessage(username, message, old_username) {}
