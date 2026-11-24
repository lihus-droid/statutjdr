# État du service — App JDR

Page d'état de l'application et du site de présentation, hébergée par GitHub Pages, **hors du serveur maison** : elle reste joignable
pendant une coupure d'Internet ou de courant chez l'hébergeur.

- La page interroge elle-même, depuis le navigateur du visiteur, la sonde publique de l'appli et du site (`/api/status`), toutes les
  30 secondes. Aucune donnée n'est envoyée ailleurs, aucun cookie, aucune mesure d'audience.
- **Annoncer une panne :** modifier `message.json` (depuis le site de GitHub, même sur téléphone : ouvrir le fichier, crayon « Edit »,
  puis « Commit changes »). Mettre le texte dans `fr` (et `en` si possible) et l'heure dans `date`. Remettre `fr` à vide quand tout est
  revenu. La page est à jour en une à deux minutes.
- Polices : Cinzel et Inter (SIL Open Font License 1.1, textes dans `fonts/`).
