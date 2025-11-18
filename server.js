const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log("Serveur Puissance 4 démarré sur ws://localhost:8080");

wss.on("connection", (ws) => {
    console.log("Client connecté");

    ws.send(JSON.stringify({
        type: "info",
        message: "Connecté au serveur Puissance 4"
    }));

    ws.on("message", (msg) => {
        let data = JSON.parse(msg);

        if (data.type === "move" || data.type === "reset") {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
});
