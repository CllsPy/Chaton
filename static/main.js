const socket = io();

const nameArea = document.getElementById("name-area");
const inputArea = document.getElementById("input-area");

const updateUser = document.getElementById("update-user-name");
const sendBtn = document.getElementById("send-btn");

const chatMessages = document.querySelector(".chat-messages");

socket.on("user_joined", (data) => {
  //atualizar HTML
  const username = data.name;
  const msg = document.createElement("div");
  msg.classList.add("system-message"); // opcional, para diferenciar
  msg.textContent = `[${username}] joined the chat`;

  // adicionar no chat
  chatMessages.appendChild(msg);

  // rolar o chat para o final (opcional)
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("set_username", (data) => {
  //atualizar HTML
  const username = data.name;
  nameArea.textContent = `Você é ${username}`;
});
