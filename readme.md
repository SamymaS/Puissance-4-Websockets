🎮 Puissance 4 Multijoueur – WebSocket & Node.js

Ce projet est une implémentation complète du Puissance 4 jouable en temps réel par deux joueurs via une connexion WebSocket.
Il inclut :

un serveur WebSocket Node.js

une interface HTML/CSS

un plateau 6×7 interactif

la synchronisation en direct des coups

l’assignation automatique des rôles :

Joueur Rouge (R) → premier connecté

Joueur Jaune (J) → deuxième connecté

spectateurs → connexions supplémentaires

les règles réelles du Puissance 4

un historique de partie (début, fin, coups)

un système de tours (on ne peut jouer que ses propres pions, uniquement à son tour)

📦 Structure du projet
Puissance4/
│
├── server.js        # Serveur WebSocket Node.js
├── index.html       # Client (jeu)
├── style.css        # Styles du jeu
└── README.md        # Documentation

⚙️ 1. Installation

Assure-toi d’avoir Node.js installé.

1️⃣ Installe les dépendances

Ouvre un terminal dans le dossier du projet :

npm init -y
npm install ws

🖥️ 2. Lancer le serveur

Le projet utilise :

un serveur WebSocket pour le jeu

un petit serveur HTTP pour servir index.html aux joueurs

2️⃣ Lancer le serveur WebSocket
node server.js


Tu dois voir :

Serveur Puissance 4 démarré sur ws://localhost:8080
Client connecté...

3️⃣ Lancer un serveur HTTP local
npx serve . -l 3000


Tu vas voir deux URL :

Local:   http://localhost:3000
Network: http://192.168.X.X:3000


👉 Si tu veux jouer sur deux PC différents, utilise l’URL Network
(ex : http://192.168.0.15:3000).

🌐 3. Jouer à deux (sur 2 PC)
🔥 IMPORTANT

Le fichier index.html se connecte automatiquement à :

ws://<host>:8080


Le <host> est automatiquement la machine qui sert la page (location.hostname).

✔️ Joueur 1 et Joueur 2 doivent tous les deux ouvrir :
http://IP_DU_SERVEUR:3000


Exemple :

http://192.168.0.15:3000

⚠️ Il ne faut pas ouvrir file:///index.html lorsqu’on joue à plusieurs.
🎮 4. Règles du jeu Puissance 4 (version intégrée)

Le plateau fait 6 lignes × 7 colonnes

Le joueur rouge (R) commence toujours

Les joueurs jouent chacun leur tour

Un joueur clique sur une colonne → le pion tombe tout en bas

Le premier à aligner 4 pions :

horizontalement

verticalement

en diagonale ↘

en diagonale ↙

Si le plateau est plein → match nul

Le bouton Réinitialiser recommence une partie pour tous les joueurs

🧠 5. Système de rôles (WebSocket)

Le serveur attribue automatiquement les rôles :

Ordre de connexion	Rôle	Couleur	Peut jouer ?
1er client	R	🔴 Rouge	✔️ Oui
2ème client	J	🟡 Jaune	✔️ Oui
3ème+	S	👀 Spectateur	❌ Non

Les spectateurs voient la partie en direct mais ne peuvent pas jouer.

📝 6. Historique des coups

La colonne de droite affiche :

⏳ Heure de début de partie

Chaque coup joué :

#3 : Joueur R → ligne 5, colonne 4


🏆 Fin de partie :

Gagnant : joueur rouge / jaune

ou match nul

Le bouton Réinitialiser vide l’historique et démarre une nouvelle partie

🔧 7. Fichiers principaux
server.js

Crée un WebSocket sur le port 8080

Assigne automatiquement les rôles

Relaye les coups (move) et les resets (reset) à tous les clients

Gère les connexions/déconnexions

index.html

Contient :

le plateau

la logique client

la gestion des tours

la synchronisation WebSocket

l’historique

style.css

Contient :

le style du plateau

les couleurs des pions

la mise en page

l'interface de l’historique

🚀 8. Améliorations possibles

Tu peux facilement ajouter :

gestion automatique quand un joueur se déconecte

salle d'attente / choix du pseudo

multiple parties en parallèle (mode lobby)

IA (bot) contre lequel jouer

animation des pions qui tombent

Si tu veux, je peux t’en coder une directement.

🎉 9. Résultat

Tu as maintenant un Puissance 4 multijoueur complet, jouable :

en local sur un seul PC

ou sur 2 PC via le réseau local

avec rôles, historique, synchronisation temps réel

et un vrai moteur de jeu avec alternance des tours