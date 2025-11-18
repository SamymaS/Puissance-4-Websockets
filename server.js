const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log("Serveur Puissance 4 démarré sur ws://localhost:8080");

// On va assigner : 1er joueur = R, 2e = J, les autres = spectateurs
let nextPlayer = 'R';

wss.on("connection", (ws) => {
    let assignedPlayer;

    if (nextPlayer === 'R') {
        assignedPlayer = 'R';     // Joueur rouge
        nextPlayer = 'J';
    } else if (nextPlayer === 'J') {
        assignedPlayer = 'J';     // Joueur jaune
        nextPlayer = null;        // Après ça, plus de joueurs, seulement des spectateurs
    } else {
        assignedPlayer = 'S';     // Spectateur
    }

    // On garde l'info sur la connexion
    ws.player = assignedPlayer;

    console.log("Client connecté avec rôle :", assignedPlayer);

    // On informe le client de son rôle
    ws.send(JSON.stringify({
        type: "assign",
        player: assignedPlayer
    }));

    ws.send(JSON.stringify({
        type: "info",
        message:
            assignedPlayer === 'R' ? "Vous êtes le joueur rouge (R)" :
            assignedPlayer === 'J' ? "Vous êtes le joueur jaune (J)" :
            "Vous êtes spectateur"
    }));

    ws.on("message", (msg) => {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            console.error("Message invalide :", msg.toString());
            return;
        }

        // Pour l'instant, on laisse le serveur "bête" : il relaie juste les coups et reset
        if (data.type === "move" || data.type === "reset") {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on("close", () => {
        console.log("Client déconnecté (rôle :", assignedPlayer, ")");
        // On pourrait réattribuer les rôles ici, mais on laisse simple pour l’instant
    });
});
