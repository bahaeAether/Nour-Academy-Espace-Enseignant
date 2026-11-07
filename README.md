# Nour Academy — Espace Enseignant

Application web de gestion pédagogique de Nour Academy, réseau de trois centres de soutien scolaire et de langues à Nador. L'espace enseignant permet aux professeurs de consulter leurs élèves, de suivre les absences et les notes, d'ajouter de nouveaux élèves et de visualiser les statistiques de leurs groupes.

## Fonctionnalités

- Liste des élèves : affichage dynamique des élèves avec leur nom, leur nombre d'absences, leur moyenne et le nombre de notes enregistrées.
- Recherche : recherche instantanée d'un élève par prénom ou nom.
- Filtrage : affichage des élèves selon leur groupe.
- Tri : classement des élèves par nom ou par moyenne.
- Gestion des absences : ajout d'une absence en un clic. À partir de trois absences, l'élève est signalé avec une alerte « Prévenir les parents ».
- Gestion des notes : ajout de notes sur 20 avec validation des valeurs saisies.
- Ajout d'un élève : formulaire avec validation en temps réel des champs (prénom, nom, groupe, email du parent, téléphone et code d'accès provisoire).
- Sécurité du formulaire : vérification des doublons dans un même groupe, limitation à 15 élèves par groupe et vérification de la complexité du code d'accès. Le code provisoire n'est pas enregistré.
- Fiche d'un élève : affichage des informations de l'élève et de toutes ses notes dans une fenêtre modale, fermable avec le bouton de fermeture, la touche Échap ou un clic à l'extérieur.
- Bilan du groupe : calcul de la moyenne générale, du nombre total d'absences et du nombre d'élèves en alerte.
- Meilleure moyenne : identification de l'élève ayant obtenu la meilleure moyenne dans le groupe sélectionné.
- Parents à appeler : affichage des coordonnées des parents des élèves ayant au moins trois absences.
- Mise à jour dynamique : actualisation des informations et des statistiques après chaque modification des données.

## Technologies

HTML5 sémantique, Tailwind CSS v4 et JavaScript natif avec modules ES6. Vite est utilisé comme outil de développement et de compilation. Aucun framework JavaScript ni bibliothèque externe n'est utilisé.

## Design

Interface responsive avec une approche mobile-first, une navigation adaptée aux petits écrans et un tableau de bord composé de statistiques. L'interface utilise une palette de couleurs sobre avec des indicateurs visuels pour les alertes et les validations de formulaire.

## Stockage des données

Les données des groupes et des élèves sont initialisées dans un fichier JavaScript (`data.js`) et manipulées directement dans le navigateur. Aucune API ni aucun serveur backend n'est utilisé dans cette version du projet. Les modifications ne sont pas conservées après le rechargement de la page.

## Méthodes JavaScript utilisées

- `map()` : génération des lignes d'élèves et préparation des coordonnées des parents.
- `filter()` : filtrage des élèves par groupe et identification des élèves en alerte.
- `find()` : récupération d'un élève ou d'un groupe à partir de son identifiant.
- `findIndex()` : identification du premier champ invalide lors de la soumission du formulaire.
- `some()` : détection des élèves en doublon.
- `every()` : vérification de la validité des champs et détection de l'absence d'alertes.
- `reduce()` : calcul des moyennes, des absences et des statistiques.
- `forEach()` : génération des éléments HTML et des options des listes déroulantes.

## Board Jira

[Nour Academy — Espace enseignant | Jira](https://bahaeddinesteam.atlassian.net/jira/software/projects/NAE/boards/38?filter=&groupBy=none&atlOrigin=eyJpIjoiZmJiZWNlMzRjYzcwNDdmY2I1MDkxNTJlODZmZjVhZmIiLCJwIjoiaiJ9)
## Site en ligne

[Nour Academy — Espace enseignant](https://bahaeaether.github.io/Nour-Academy-Espace-Enseignant/)
