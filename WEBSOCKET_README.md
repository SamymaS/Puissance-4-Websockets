# 📡 Comprendre le Fonctionnement WebSocket dans le Projet Puissance 4

Ce document explique en détail **comment les WebSockets sont utilisées**
dans ce projet Puissance 4 multijoueur, ainsi que **le déroulement exact
de chaque action côté client et serveur**.

------------------------------------------------------------------------

# 🔌 1. Qu'est‑ce qu'une WebSocket ?

Une WebSocket est une connexion **bidirectionnelle et persistante**
entre un client (navigateur) et un serveur.

Contrairement au HTTP classique (requête → réponse), une WebSocket
permet :

-   d'envoyer des messages **en temps réel**
-   sans recharger la page
-   sans polling
-   avec une **latence très faible**

Dans ce projet, les WebSockets permettent :

-   la synchronisation du plateau entre les joueurs\
-   la transmission des coups instantanément\
-   la gestion des rôles (Rouge / Jaune / Spectateur)\
-   la réinitialisation en temps réel

------------------------------------------------------------------------

# 🏗️ 2. Architecture WebSocket du projet

    Navigateur Joueur 1        ─┐
                               ├── Serveur WebSocket Node.js
    Navigateur Joueur 2        ─┘
           Spectateurs ────────┘

Le serveur WebSocket :

-   accepte des connexions
-   attribue un rôle
-   reçoit les actions d'un joueur
-   les renvoie à **tous les clients** connectés

------------------------------------------------------------------------

# 🧠 3. Les types de messages WebSocket

Le projet utilise un format JSON simple.

## 📤 Messages envoyés **du client → serveur**

### **1. move**

Envoyé lorsqu'un joueur clique sur une colonne.

``` json
{
  "type": "move",
  "column": 3
}
```

### **2. reset**

Envoyé lorsqu'un joueur clique sur « Réinitialiser ».

``` json
{
  "type": "reset"
}
```

------------------------------------------------------------------------

## 📥 Messages envoyés **du serveur → clients**

### **1. role**

Attribue Rouge / Jaune / Spectateur.

``` json
{ "type": "role", "role": "R" }
```

### **2. update**

Un coup a été joué → mise à jour du plateau.

``` json
{
  "type": "update",
  "column": 3,
  "row": 5,
  "player": "R"
}
```

### **3. reset**

Tout le monde remet le plateau à zéro.

``` json
{ "type": "reset" }
```

------------------------------------------------------------------------

# 🎯 4. Cycle complet d'un clic dans le jeu

Voici ce qui se passe **exactement** lorsque tu cliques sur une colonne.

------------------------------------------------------------------------

# 🖱️ Étape 1 : Le joueur clique

Le navigateur détecte :

    onclick → handleMove(colonne)

Le client vérifie :

-   Est‑ce à mon tour ?\
-   Suis‑je un joueur (pas spectateur) ?\
-   La colonne n'est pas pleine ?

➡️ Si tout est OK → le client envoie :

``` json
{ "type": "move", "column": X }
```

------------------------------------------------------------------------

# 🌐 Étape 2 : Le serveur reçoit le message

Le serveur vérifie :

1.  Le joueur est‑il autorisé à jouer ?
2.  Est‑ce bien son tour ?
3.  La colonne est‑elle valide ?
4.  La partie n'est pas déjà finie ?

➡️ Si c'est valide :

-   le serveur calcule la **ligne disponible**
-   place le pion dans son modèle du plateau
-   change de joueur
-   vérifie la victoire

Puis **diffuse à tout le monde** :

``` json
{
  "type": "update",
  "column": X,
  "row": Y,
  "player": "R"
}
```

------------------------------------------------------------------------

# 🖥️ Étape 3 : Tous les clients mettent le pion

Chaque navigateur exécute :

    placerPion(colonne, ligne, joueur)

-   l'interface met à jour la case
-   l'historique note le coup
-   les tours changent (affichage : "Au joueur Jaune")

------------------------------------------------------------------------

# 🏆 Étape 4 : Le serveur détecte la victoire ou le match nul

Si un joueur gagne :

``` json
{
  "type": "gameover",
  "winner": "J"
}
```

Les clients :

-   affichent le message **"Le joueur Jaune gagne !"**
-   bloquent les clics tant qu'il n'y a pas de reset

Si le plateau est plein :

``` json
{ "type": "gameover", "winner": "none" }
```

------------------------------------------------------------------------

# 🔄 5. Fonctionnement du bouton Réinitialiser

Quand un joueur clique :

➡️ Le client envoie :

``` json
{ "type": "reset" }
```

➡️ Le serveur :

-   réinitialise son plateau interne
-   remet le tour au joueur Rouge
-   réinitialise l'historique

➡️ Diffuse :

``` json
{ "type": "reset" }
```

➡️ Tous les navigateurs :

-   effacent le plateau
-   effacent l'historique
-   rechargent l'affichage

------------------------------------------------------------------------

# 👥 6. Attribution des rôles : comment ça marche ?

À chaque nouvelle connexion :

1.  Le serveur compte le nombre de joueurs déjà présents.
2.  Si 0 → nouveau joueur = **Rouge (R)**\
3.  Si 1 → nouveau joueur = **Jaune (J)**\
4.  Si 2+ → **Spectateur (S)**

Le serveur envoie immédiatement :

``` json
{ "type": "role", "role": "R" }
```

Les spectateurs peuvent :

-   voir les coups en direct
-   voir la victoire
-   voir les resets

Mais **jamais jouer**.

------------------------------------------------------------------------

# 📚 7. Résumé du flux d'informations

    [Joueur clique]
          ↓
    [Client envoie "move"]
          ↓
    [Serveur reçoit → valide → calcule]
          ↓
    [Serveur envoie "update" à tous]
          ↓
    [Clients mettent le pion]
          ↓
    [Serveur vérifie victoire]

------------------------------------------------------------------------

# 🧩 8. Avantages des WebSockets dans ce projet

-   Temps réel parfait pour un jeu multijoueur
-   Pas de latence perceptible
-   Code simple et léger
-   Communication continue et bidirectionnelle
-   Synchronisation fiable entre 2, 5 ou 50 clients

------------------------------------------------------------------------

# 🎉 9. Conclusion

Grâce aux WebSockets, ce projet Puissance 4 :

-   est **réellement multijoueur simultané**
-   fonctionne en réseau local ou internet
-   synchronise instantanément le plateau
-   gère les rôles, les tours, et les resets
-   offre une architecture simple et extensible

Si tu veux, je peux aussi préparer : ✅ un schéma graphique du
fonctionnement\
✅ une version PDF\
✅ un README plus "pro", avec badges GitHub, sections, screenshots

Demande-moi ! 🚀
