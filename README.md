# AY Automate · Site statique

Ce dépôt contient un site vitrine complet pour AY Automate, prêt à être publié en public sur GitHub Pages.

## Aperçu
- Sections : hero, services, méthode, réalisations, offres et formulaire de contact.
- Design moderne en HTML/CSS pur, sans dépendances externes hormis la police Google Fonts.
- Formulaire de contact avec message de confirmation côté client.

## Utilisation locale
1. Cloner le dépôt.
2. Ouvrir `index.html` dans votre navigateur **ou** lancer un petit serveur statique :
   ```bash
   python -m http.server 8000
   ```
3. Visiter http://localhost:8000 pour naviguer dans le site.

## Déploiement sur GitHub Pages
1. Pousser le dépôt sur GitHub.
2. Dans les paramètres du dépôt, section **Pages**, choisir la branche `main` (ou `master`) et le dossier racine `/`.
3. Enregistrer : le site sera disponible en quelques minutes sur l'URL fournie par GitHub Pages.

## Personnalisation
- Mettre à jour les textes dans `index.html`.
- Ajuster la palette ou la mise en page dans `styles.css`.
- Adapter le comportement du formulaire et les interactions dans `script.js`.
