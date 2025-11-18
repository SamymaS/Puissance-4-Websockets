# 🎮 Puissance 4 Multijoueur -- WebSocket & Node.js

Ce projet est une implémentation complète du **Puissance 4 jouable en
temps réel** par deux joueurs via WebSocket.\
Il inclut :

-   un **serveur WebSocket Node.js**
-   une **interface HTML/CSS**
-   un **plateau 6×7 interactif**
-   la **synchronisation en direct** des coups
-   l'**assignation automatique des rôles**
-   les **règles officielles du Puissance 4**
-   un **historique de partie**
-   un **système strict de tours**

## 📦 Structure du projet

    Puissance4/
    │
    ├── server.js        # Serveur WebSocket Node.js
    ├── index.html       # Client (jeu)
    ├── style.css        # Styles du jeu
    └── README.md        # Documentation

## ⚙️ 1. Installation

Assure-toi d'avoir **Node.js** installé.

### 1️⃣ Installer les dépendances

``` bash
npm init -y
npm install ws
```

## 🖥️ 2. Lancer le serveur

Le projet utilise :

-   un **serveur WebSocket** pour le jeu
-   un **serveur HTTP** pour servir `index.html`

### 2️⃣ Lancer le serveur WebSocket

``` bash
node server.js
```

Tu dois voir :

    Serveur Puissance 4 démarré sur ws://localhost:8080
    Client connecté...

### 3️⃣ Lancer un serveur HTTP local

``` bash
npx serve . -l 3000
```

Tu vas obtenir :

-   **Local :** http://localhost:3000\
-   **Network :** http://192.168.X.X:3000

👉 Pour jouer à plusieurs PC : utilise l'URL **Network**.

## 🌐 3. Jouer à deux (sur 2 PC)

Le client se connecte automatiquement à :

    ws://<host>:8080

Le `<host>` correspond à `location.hostname`.

✔️ Chaque joueur doit ouvrir :\
**http://IP_DU_SERVEUR:3000**

Exemple :\
http://192.168.0.15:3000

❌ Ne pas ouvrir `file:///index.html` en mode multijoueur.

## 🎮 4. Règles du jeu intégrées

-   Plateau : **6 lignes × 7 colonnes**
-   **Rouge (R)** commence toujours
-   Les joueurs jouent à tour de rôle
-   Un clic = le pion tombe dans la colonne
-   Un joueur gagne dès qu'il aligne **4 pions** :
    -   horizontalement
    -   verticalement
    -   diagonale ↘
    -   diagonale ↙
-   Plateau plein = **match nul**
-   Bouton **Réinitialiser** → nouvelle partie synchronisée

## 🧠 5. Système de rôles (WebSocket)

  Ordre de connexion   Rôle   Couleur         Peut jouer ?
  -------------------- ------ --------------- --------------
  1er client           R      🔴 Rouge        ✔️ Oui
  2ème client          J      🟡 Jaune        ✔️ Oui
  3ème+                S      👀 Spectateur   ❌ Non

## 📝 6. Historique des coups

-   ⏳ **Heure de début**

-   Chaque coup :

        #3 : Joueur R → ligne 5, colonne 4

-   🏆 **Fin de partie**

    -   gagnant (rouge / jaune)
    -   ou **match nul**

## 🔧 7. Fichiers principaux

### `server.js`

-   Crée le WebSocket (port 8080)
-   Assigne automatiquement les rôles
-   Relaye les messages `move` et `reset`
-   Gère connexions/déconnexions

### `index.html`

-   plateau
-   logique client
-   gestion des tours
-   WebSocket client
-   historique

### `style.css`

-   styles du plateau
-   couleurs des pions
-   mise en page
-   interface de l'historique

## 🚀 8. Améliorations possibles

-   gestion automatique en cas de déconnexion
-   salle d'attente + pseudos
-   plusieurs parties en parallèle (lobby)
-   IA (bot)
-   animations de chute des pions

## 🎉 9. Résultat

Un **Puissance 4 multijoueur complet**, jouable en local ou réseau
local, avec synchronisation en temps réel et moteur de jeu complet.
