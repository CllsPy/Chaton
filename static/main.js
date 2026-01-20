const socket = io();

const nameArea = document.getElementById("name-area");
const inputArea = document.getElementById("input-area");

const updateUser = document.getElementById("update-user-name");
const sendBtn = document.getElementById("send-btn");

const chatMessages = document.querySelector(".chat-messages");

socket.on("user_joined", (data) => {
  const username = data.name;
  const msg = document.createElement("div");
  msg.classList.add("system-message");
  msg.textContent = `[${username}] joined the chat`;

  chatMessages.appendChild(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("set_username", (data) => {
  const username = data.name;
  nameArea.textContent = `Você é ${username}`;
});
