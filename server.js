import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = 3000;

// 1. Webserver
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
};

const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(PUBLIC_DIR, filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Nicht gefunden");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain" });
    res.end(content);
  });
});

// 2. WebSocket-Server
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Neuer Client verbunden. Aktuell online:", wss.clients.size);

  socket.on("message", (raw) => {
    const message = raw.toString();
    console.log("Nachricht erhalten:", message);

    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    }
  });

  socket.on("close", () => {
    console.log("Client getrennt. Aktuell online:", wss.clients.size);
  });
});

server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`Lokal öffnen: http://localhost:${PORT}`);
});
