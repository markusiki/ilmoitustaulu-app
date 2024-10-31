// server.js
const WebSocket = require("ws");

// Luo WebSocket-palvelin
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Lähetä viesti, kun asiakas muodostaa yhteyden
  ws.send(JSON.stringify({ message: "Welcome to WebSocket Server!" }));

  // Kuuntele viestejä asiakkailta
  ws.on("message", (message) => {
    console.log("Received:", message);
    // Lähetä viesti takaisin kaikille asiakkaille
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");