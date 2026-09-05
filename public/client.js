// Verbindung mit der IP aus der Browser URL Zeile (Server)
const socket = new WebSocket(`ws://${location.hostname}:3000`);

// Holt sich das <div> Element aus dem html mit der id "messages"
const messagesEl = document.getElementById("messages");

// Holt sich das <form> Element aus dem html mit der id "form"
const form = document.getElementById("form");

// Holt sich das <input> Element aus dem html mit der id "name"
const nameInput = document.getElementById("name");

// Holt sich das <input> Element aus dem html mit der id "text"
const textInput = document.getElementById("text");

// Beginnt auf das Event "open" zu hören (Verbindung zum Server öffnet sich)
socket.addEventListener("open", () => {
  // Wenn das Event kommt, wird die Funktion addSystemMessage aufgerufen
  addSystemMessage("Verbunden mit dem Server");
});

// Beginnt auf das Event "close" zu hören (Verbindung zum Server schliesst sich)
socket.addEventListener("close", () => {
  // Wenn das Event kommt, wird die Funktion addSystemMessage aufgerufen
  addSystemMessage("Verbindung getrennt");
});

// Beginnt auf das Event "message" zu hören (Eine Nachricht vom Server kommt)
socket.addEventListener("message", (event) => {
  // Liest die Daten (Nachricht) aus dem Event aus
  const data = JSON.parse(event.data);
  // Ruf die Funktion addMessage mit dem Inhalt der Nachricht auf
  addMessage(data.name, data.text);
});

// Beginnt auf das Event "submit" zu hören (Der Button senden wurde geklickt)
form.addEventListener("submit", (e) => {
  // Stoppt das weitergeben des Events
  e.preventDefault();

  // Liest den Text aus den <input> Elementen aus und erstellt das Objekt für die Kommunikation
  const payload = JSON.stringify({
    name: nameInput.value,
    text: textInput.value,
  });

  // Sendet das Objekt an den Server
  socket.send(payload);

  // Leert den Inhalt des <input> Elements "text", damit der User etwas Neues eingeben kann
  textInput.value = "";
});

// Diese Funktion fügt eine Chat-Nachricht die von einem anderen User gesendet worden ist zu den anderen Nachrichten hinzu
function addMessage(name, text) {
  // Erstellt ein html Element mit em <p> tag (Paragraph)
  const p = document.createElement("p");
  // Kombiniert den erhaltenen Namen und Text zu einer Zeile und fügt den Text dem Element hinzu
  p.textContent = `${name}: ${text}`;
  // Fügt das neue Element dem Nachrichtenbereich hinzu
  messagesEl.appendChild(p);
  // Scrollt hoch und stellt sicher, dass die Nachricht sichtbar ist
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Diese Funktion fügt eine System-Nachricht die vom Server gekommen ist zu den anderen Nachrichten hinzu
function addSystemMessage(text) {
  // Erstellt ein html Element mit em <p> tag (Paragraph)
  const p = document.createElement("p");
  // Setzt die Farbe und den Schriftstil des Elements
  p.style.color = "#888";
  p.style.fontStyle = "italic";
  // Fügt den Text dem Element hinzu
  p.textContent = text;
  // Fügt das neue Element dem Nachrichtenbereich hinzu
  messagesEl.appendChild(p);
  // Scrollt hoch und stellt sicher, dass die Nachricht sichtbar ist
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
