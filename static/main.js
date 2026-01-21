const socket = io();

let meuUsername = "";

const nameArea = document.getElementById("name-area");
const inputArea = document.getElementById("input-area");
const btnUpdate = document.getElementById("update-user-name");

const updateUser = document.getElementById("update-user-name");
const sendBtn = document.getElementById("send-btn");

const chatMessages = document.querySelector(".chat-messages");

socket.on("user_joined", (data) => {
  const username = data.name;
  const msg = document.createElement("div");
  msg.classList.add("system-message");
  msg.textContent = `[${username}] está online!`;

  chatMessages.appendChild(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("set_username", (data) => {
  const username = data.name;
  meuUsername = data.name;
  nameArea.textContent = `Você é ${username}`;
});

sendBtn.addEventListener("click", sendMessage);

inputArea.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

socket.on("user_left", (data) => {
  console.log("HI");
  username = data.name;
  const msg = document.createElement("div");
  msg.classList.add("off");
  msg.textContent = `[${username}] está offline`;

  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("new_message", (data) => {
  addMessage(data);
});

// send mensagem
function sendMessage() {
  let content = inputArea.value.trim();

  if (content !== "") {
    socket.emit("send_message", content);
    inputArea.value = "";
    console.log(content);
  }
}

// addMsg
function addMessage(data) {
  const username = data.name;
  const userAvatar = data.avatar;
  const userMsg = data.msg;

  const container = document.createElement("div");
  container.classList.add("message-container");

  console.log("Comparação:", username, meuUsername, username === meuUsername);
  if (username === meuUsername) {
    container.classList.add("sent");
    console.log(username);
  } else {
    container.classList.add("received");
  }

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("message-content");

  const span = document.createElement("span");
  span.classList.add("username");
  span.textContent = username;

  const paragraph = document.createElement("p");
  paragraph.classList.add("message-text");
  paragraph.textContent = userMsg;

  contentDiv.appendChild(span);
  contentDiv.appendChild(paragraph);
  container.appendChild(contentDiv);
  chatMessages.appendChild(container);

  chatMessages.scrollTop = chatMessages.scrollHeight;
  console.log("Classe adicionada:", container.classList);
}

function updateUserName() {
  let nameAreaValue = nameArea.value.trim();
  nameArea.value = "";
  socket.emit("username-update", nameAreaValue);
}

btnUpdate.addEventListener("click", updateUserName);
