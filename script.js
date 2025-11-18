const NUM_ROWS = 6;
        const NUM_COLS = 7;

        // 🔹 host = IP ou hostname qui sert la page, ou localhost si file://
        const host = location.hostname || "localhost";
        const ws = new WebSocket(`ws://${host}:8080`);

        const connectionEl = document.getElementById("connection");
        const statusEl = document.getElementById("status");
        const boardEl = document.getElementById("board");
        const historyEl = document.getElementById("history");

        // board[row][col] = null | "R" | "J"
        let board = Array.from({ length: NUM_ROWS }, () =>
            Array(NUM_COLS).fill(null)
        );
        let currentPlayer = "R"; // R (rouge) commence
        let gameOver = false;

        // 🔹 rôle de CE client : "R", "J" ou "S" (spectateur)
        let myPlayer = null;

        // Historique des coups
        let moveHistory = [];

        // Création du plateau (6 lignes x 7 colonnes)
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Sur clic, on joue dans cette colonne
                cell.addEventListener("click", () => handleColumnClick(col));

                boardEl.appendChild(cell);
            }
        }

        // ---- WebSocket ----
        ws.onopen = () => {
            console.log("WebSocket connecté");
        };

        ws.onerror = (err) => {
            console.error("Erreur WebSocket", err);
            connectionEl.textContent = "Erreur de connexion WebSocket";
        };

        ws.onclose = () => {
            console.log("WebSocket fermé");
            connectionEl.textContent = "Connexion fermée";
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            // 🔹 Le serveur nous assigne un rôle : "R", "J" ou "S"
            if (msg.type === "assign") {
                myPlayer = msg.player;

                if (myPlayer === 'R') {
                    connectionEl.textContent = "Connecté – Vous êtes le joueur rouge (R)";
                } else if (myPlayer === 'J') {
                    connectionEl.textContent = "Connecté – Vous êtes le joueur jaune (J)";
                } else {
                    connectionEl.textContent = "Connecté – Vous êtes spectateur";
                }
                return; // on sort, ce n'est pas un coup
            }

            if (msg.type === "info") {
                console.log(msg.message);
            }

            if (msg.type === "move") {
                applyMoveFromServer(msg.col);
            }

            if (msg.type === "reset") {
                resetLocalGame();
            }
        };

        // Quand on clique une colonne, on envoie juste la demande de coup
        function handleColumnClick(col) {
            if (gameOver || ws.readyState !== WebSocket.OPEN) return;

            // 🔹 Si on ne connaît pas encore notre rôle, ou spectateur → pas le droit de jouer
            if (myPlayer === null || myPlayer === 'S') {
                return;
            }

            // 🔹 Ce n'est pas notre tour → on ne joue pas
            if (myPlayer !== currentPlayer) {
                return;
            }

            // Si tout est OK : on envoie le coup au serveur
            ws.send(JSON.stringify({
                type: "move",
                col: col
            }));
        }

        // Tous les coups passent par ici (reçus du serveur)
        function applyMoveFromServer(col) {
            if (gameOver) return;

            // Trouver la première case libre en partant du bas
            let rowToPlace = null;
            for (let row = NUM_ROWS - 1; row >= 0; row--) {
                if (board[row][col] === null) {
                    rowToPlace = row;
                    break;
                }
            }
            if (rowToPlace === null) {
                // Colonne pleine, on ignore
                return;
            }

            board[rowToPlace][col] = currentPlayer;

            const cellEl = document.querySelector(
                `.cell[data-row="${rowToPlace}"][data-col="${col}"]`
            );
            cellEl.classList.add(currentPlayer === "R" ? "player-R" : "player-J");

            // 🔹 Ajouter le coup à l'historique
            logMove(currentPlayer, rowToPlace, col);

            if (checkWin(currentPlayer)) {
                statusEl.textContent = `Le joueur ${currentPlayer} a gagné !`;
                gameOver = true;
                // 🔹 Historique : fin de partie + gagnant
                logGameEnd(currentPlayer);
                return;
            }

            // Vérifier match nul
            if (isBoardFull()) {
                statusEl.textContent = "Match nul !";
                gameOver = true;
                // 🔹 Historique : fin de partie, match nul
                logGameEnd(null);
                return;
            }

            // Changer de joueur
            currentPlayer = (currentPlayer === "R") ? "J" : "R";
            statusEl.textContent = `Au tour de ${currentPlayer} (${currentPlayer === "R" ? "rouge" : "jaune"})`;
        }

        function isBoardFull() {
            return board.every(row => row.every(cell => cell !== null));
        }

        function checkWin(player) {
            const directions = [
                { dr: 0, dc: 1 },   // →
                { dr: 1, dc: 0 },   // ↓
                { dr: 1, dc: 1 },   // ↘
                { dr: 1, dc: -1 }   // ↙
            ];

            for (let row = 0; row < NUM_ROWS; row++) {
                for (let col = 0; col < NUM_COLS; col++) {
                    if (board[row][col] !== player) continue;

                    for (const { dr, dc } of directions) {
                        let count = 1;

                        for (let k = 1; k < 4; k++) {
                            const r = row + dr * k;
                            const c = col + dc * k;

                            if (
                                r < 0 || r >= NUM_ROWS ||
                                c < 0 || c >= NUM_COLS ||
                                board[r][c] !== player
                            ) {
                                break;
                            }
                            count++;
                        }

                        if (count >= 4) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function sendReset() {
            if (ws.readyState !== WebSocket.OPEN) return;
            ws.send(JSON.stringify({ type: "reset" }));
        }

        function resetLocalGame() {
            board = Array.from({ length: NUM_ROWS }, () =>
                Array(NUM_COLS).fill(null)
            );
            currentPlayer = "R";
            gameOver = false;

            document.querySelectorAll(".cell").forEach(cell => {
                cell.classList.remove("player-R", "player-J");
            });

            // 🔹 Réinitialiser l'historique pour la nouvelle partie
            moveHistory = [];
            historyEl.innerHTML = "";
            logGameStart();

            statusEl.textContent = "Au tour de R (rouge)";
        }

        function logMove(player, row, col) {
            const moveNumber = moveHistory.length + 1;
            const rowDisplay = row + 1;   // 1 à 6 (haut → bas)
            const colDisplay = col + 1;   // 1 à 7 (gauche → droite)

            const entryText = `#${moveNumber} : Joueur ${player} → ligne ${rowDisplay}, colonne ${colDisplay}`;

            moveHistory.push({
                moveNumber,
                player,
                row: rowDisplay,
                col: colDisplay
            });

            const entry = document.createElement("div");
            entry.className = "move-entry";
            entry.textContent = entryText;

            historyEl.appendChild(entry);
            historyEl.scrollTop = historyEl.scrollHeight;
        }

        function logGameStart() {
            const time = new Date().toLocaleTimeString();
            const entry = document.createElement("div");
            entry.className = "move-entry";
            entry.textContent = `Partie commencée à ${time}`;
            historyEl.appendChild(entry);
            historyEl.scrollTop = historyEl.scrollHeight;
        }

        function logGameEnd(winner) {
            const time = new Date().toLocaleTimeString();
            const entry = document.createElement("div");
            entry.className = "move-entry";

            if (winner === "R") {
                entry.textContent = `Partie terminée à ${time} – Gagnant : joueur rouge`;
            } else if (winner === "J") {
                entry.textContent = `Partie terminée à ${time} – Gagnant : joueur jaune`;
            } else {
                entry.textContent = `Partie terminée à ${time} – Match nul`;
            }

            historyEl.appendChild(entry);
            historyEl.scrollTop = historyEl.scrollHeight;
        }

        resetLocalGame();
