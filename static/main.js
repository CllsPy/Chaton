const socket = io();

let currentUsername = "";

currentUsernameSpan = document.getElementById("current-username");
sendButton = document.getElementById("send-button");
messageInput = document.getElementById("message-input");
updateButton = document.getElementById("update-username-button");
usernameInput = document.getElementById("username-input");
chatMessage = document.getElementById("chat-messages");

// listen set username
socket.on("set_username", (data) => {
  currentUsername = `${data.username}`;
  currentUsernameSpan.textContent = currentUsername;
});

// listen user joined
socket.on("user_joined", (data) => {
  addMessage(`${data.username} joined the chat`, "system");
});

// liste to user left
socket.on("user_disconnected", (data) => {
  addMessage(`${data.username} left the chat`, "system");
});

// listen to message
socket.on("new_message", (data) => {
  console.log("Dados recebidos:", data);
  addMessage(data.message, "user", data.username, data.avatar);
});

// liste to update name
socket.on("username_updated", (data) => {
  addMessage(
    `User ${data.old} update his name to ${data.new}`,
    "system",
    data.username,
  );
});

// send message
sendButton.addEventListener("click", sendMessage);

// accept enteder button (send message)
messageInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// update username
updateButton.addEventListener("click", updateUsername);

// functions
function sendMessage() {
  const message = messageInput.value.trim();

  if (message) {
    socket.emit("send_message", { message });
    messageInput.value = "";
  }
}

// update username
function updateUsername() {
  const newUsername = usernameInput.value.trim();

  if (newUsername && newUsername !== currentUsername) {
    socket.emit("update_username", { username: newUsername });
    usernameInput.value = "";
  }
}

// addMessage
function addMessage(message, type, username = "", avatar = "") {
  const messageElement = document.createElement("div");
  messageElement.className = "message";

  if (type === "user") {
    const isSentMessage = username === currentUsername;
    if (isSentMessage) {
      messageElement.classList.add("sent");
    }

    const avatarImg = document.createElement("img");
    avatarImg.src = avatar;
    avatarImg.className = "avatar";
    messageElement.appendChild(avatarImg);

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    const usernameDiv = document.createElement("div");
    usernameDiv.className = "username-content";
    usernameDiv.textContent = username;
    contentDiv.appendChild(usernameDiv);

    const messageText = document.createElement("div");
    messageText.textContent = message;
    contentDiv.appendChild(messageText);

    messageElement.appendChild(contentDiv);
  } else {
    messageElement.className = "system";
    messageElement.textContent = message;
  }
  chatMessage.appendChild(messageElement);
}
