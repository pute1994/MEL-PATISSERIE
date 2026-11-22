# Mel Pâtisserie & Snacks — Gestion

Application de gestion de la boutique : commandes avec rappels, achats de matières premières, ventes et bénéfice du mois.

- S'utilise sur téléphone et ordinateur, et s'installe sur l'écran d'accueil comme une application.
- Les données sont enregistrées dans une feuille Google Sheets (onglets `commandes`, `achats`, `ventes`).
- Sans réseau, l'application continue de fonctionner : les modifications sont envoyées à la feuille dès que la connexion revient.

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | L'application |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | Installation sur le téléphone et fonctionnement hors ligne |
| `apps-script/Code.gs` | Le script à coller dans Google Sheets (pas utilisé par GitHub lui-même) |

## Mise en route

1. **Google Sheets** : créer une feuille vide, ouvrir *Extensions > Apps Script*, coller `apps-script/Code.gs`, remplacer `CHANGE-MOI` par un code secret, enregistrer, puis *Déployer > Nouveau déploiement > Application Web* (Exécuter en tant que : **Moi**, Accès : **Tout le monde**). Copier l'adresse qui finit par `/exec`.
2. **GitHub Pages** : dans le dépôt, *Settings > Pages*, Source : *Deploy from a branch*, branche `main`, dossier `/ (root)`. L'adresse de l'application sera `https://<ton-pseudo>.github.io/<nom-du-depot>/`.
3. **Dans l'application** : bouton ⚙ en haut à droite, coller l'adresse du script et le code secret, puis *Enregistrer et tester*.

L'adresse du script et le code secret ne sont jamais écrits dans le dépôt : ils restent sur chaque appareil.

## Mettre à jour l'application

Remplacer `index.html` dans le dépôt, puis changer le numéro de `VERSION` dans `sw.js` (par exemple `mel-gestion-v2`) pour que les téléphones prennent la nouvelle version.

Si tu modifies `Code.gs`, refais *Déployer > Gérer les déploiements > Modifier > Nouvelle version* pour garder la même adresse.
