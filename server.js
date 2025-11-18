// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log("Serveur Puissance 4 démarré sur ws://localhost:8080");

wss.on('connection', (ws) => {
    console.log('Client connecté');

    ws.send(JSON.stringify({
        type: 'info',
        message: 'Connecté au serveur Puissance 4'
    }));

    ws.on('message', (msg) => {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            console.error('JSON invalide :', msg.toString());
            return;
        }

        // On ne relaye que les messages connus
        if (data.type === 'move' || data.type === 'reset') {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
});
