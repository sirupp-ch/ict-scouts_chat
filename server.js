// Der Computer lädt das "http"-Werkzeug, damit er Webseiten senden kann.
import http from "node:http";
// Der Computer lädt das "Dateien"-Werkzeug, damit er Dateien öffnen kann.
import fs from "node:fs";
// Der Computer lädt das "Pfad"-Werkzeug, damit er Pfadnamen richtig zusammensetzen kann.
import path from "node:path";
// Das hilft dem Computer, den Ort dieser Datei im Projekt zu finden.
import { fileURLToPath } from "node:url";
// Das lädt die Chat-Kanäle, damit mehrere Browser miteinander sprechen können.
import { WebSocketServer } from "ws";

// Diese Zeile merkt sich den Ordner, in dem diese Datei liegt.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Dieser Ordner enthält die Webseiten-Dateien für den Browser.
const PUBLIC_DIR = path.join(__dirname, "public");
// Der Server hört auf Port 3000, so wie ein Haus mit einer Türnummer.
const PORT = 3000;

// (Webserver) Der erste Teil macht die Webseite für den Browser sichtbar.
const MIME_TYPES = {
  // HTML-Dateien sind Webseiten im Browser.
  ".html": "text/html",
  // CSS-Dateien geben der Seite Farben und Stil.
  ".css": "text/css",
  // JavaScript-Dateien machen Dinge im Browser beweglich.
  ".js": "text/javascript",
};

// Der Server wird gestartet und wartet auf Anfragen aus dem Browser.
const server = http.createServer((req, res) => {
  // Wenn wir auf die Startseite gehen, holen wir die Hauptseite.
  let filePath = req.url === "/" ? "/index.html" : req.url;
  // Jetzt bauen wir den richtigen Dateipfad zusammen.
  filePath = path.join(PUBLIC_DIR, filePath);

  // Der Server öffnet die gewünschte Datei und liest ihren Inhalt.
  fs.readFile(filePath, (err, content) => {
    // Wenn die Datei nicht gefunden wurde, geht es hier rein.
    if (err) {
      // Der Browser bekommt die Antwort: "Nicht gefunden".
      res.writeHead(404);
      // Der Server schickt die Nachricht an den Browser.
      res.end("Nicht gefunden");
      // Danach stoppt das Programm hier.
      return;
    }
    // Diese Zeile schaut, welche Dateiendung die Datei hat.
    const ext = path.extname(filePath);
    // Der Server sagt dem Browser, welche Art von Datei er bekommt.
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain" });
    // Der Server schickt den Inhalt der Datei zurück an den Browser.
    res.end(content);
  });
});

// (WebSocket-Server) Der zweite Teil macht den Chat zwischen mehreren Browsern möglich.
const wss = new WebSocketServer({ server });

// Wenn ein neuer Browser sich verbindet, startet diese Funktion.
wss.on("connection", (socket) => {
  // Der Server schreibt in die Konsole, wer gerade da ist.
  console.log("Neuer Client verbunden. Aktuell online:", wss.clients.size);

  // Wenn ein Browser eine Nachricht sendet, passiert das hier.
  socket.on("message", (raw) => {
    // Die Nachricht wird in einen Text umgewandelt.
    const message = raw.toString();
    // Der Server zeigt den Text in der Konsole an.
    console.log("Nachricht erhalten:", message);

    // Der Server schaut sich alle verbundenen Browser an.
    for (const client of wss.clients) {
      // Wenn ein Browser noch offen ist, darf er die Nachricht bekommen.
      if (client.readyState === client.OPEN) {
        // Der Server schickt die Nachricht an alle offenen Browser.
        client.send(message);
      }
    }
  });

  // Wenn ein Browser die Verbindung schließt, passiert das hier.
  socket.on("close", () => {
    // Der Server schreibt, dass jemand weggegangen ist.
    console.log("Client getrennt. Aktuell online:", wss.clients.size);
  });
});

// Der Server startet wirklich und hört auf dem angegebenen Port.
server.listen(PORT, () => {
  // Der Server schreibt in die Konsole, auf welchem Port er läuft.
  console.log(`Server läuft auf Port ${PORT}`);
  // Der Server zeigt den Link an, den wir im Browser öffnen können.
  console.log(`Lokal öffnen: http://localhost:${PORT}`);
});
