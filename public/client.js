const socket = new WebSocket(`ws://${location.hostname}:3000`);

const messagesEl = document.getElementById("messages");
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const textInput = document.getElementById("text");

socket.addEventListener("open", () => {
  addSystemMessage("Verbunden mit dem Server");
});

socket.addEventListener("close", () => {
  addSystemMessage("Verbindung getrennt");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  addMessage(data.name, data.text);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = JSON.stringify({
    name: nameInput.value,
    text: textInput.value,
  });
  socket.send(payload);
  textInput.value = "";
});

function addMessage(name, text) {
  const p = document.createElement("p");
  p.textContent = `${name}: ${text}`;
  messagesEl.appendChild(p);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addSystemMessage(text) {
  const p = document.createElement("p");
  p.style.color = "#888";
  p.style.fontStyle = "italic";
  p.textContent = text;
  messagesEl.appendChild(p);
}
