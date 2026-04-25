# Specs du site Patrick Pitot

## Contexte

Patrick Pitot conçoit et fabrique artisanalement des couteaux. Le site doit servir à la fois de vitrine, de catalogue et de point d'entrée pour les demandes de commande.

Le site est une application React/Vite déployée sur Netlify. Les pages publiques sont servies par React Router, avec une règle Netlify `_redirects` pour permettre le rafraîchissement direct des URLs comme `/boutique`.

## Objectifs

- Présenter l'univers artisanal de Patrick Pitot.
- Mettre en valeur les couteaux fabriqués à la main.
- Montrer les matières disponibles : bois naturel, bois stabilisé, micarta.
- Présenter la personnalisation par gravure sur lame.
- Permettre la consultation d'un catalogue.
- Préparer la saisie de demandes de contact, commandes et commandes personnalisées en base.
- Préparer une future interface d'administration pour Patrick.

## Identité Visuelle

Le site doit transmettre une impression de travail manuel, de précision, de caractère et d'authenticité.

Le logo utilise les deux lettres grecques `π` et `τ`, pour évoquer "Pi" + "Tau" et former une signature proche de "Pitot". La version actuelle est un monogramme `πτ` centré dans un cercle en contour, sans fond plein.

Le logo est utilisé dans :

- la barre de navigation ;
- le favicon du site via `public/favicon.svg`.

## Pages Publiques

### Accueil `/`

- Présentation courte de la coutellerie artisanale.
- Mise en avant d'une photo forte.
- Accès rapide à la boutique, aux matières et à la demande sur mesure.

### Boutique `/boutique`

- Liste des premières pièces à présenter.
- Affichage par carte produit avec image, matière, description et prix "sur demande".
- Les produits actuels sont encore définis côté React, mais ils sont aussi seedés en base.

### Matières `/matieres`

- Présentation des familles de manches :
- bois naturel ;
- bois stabilisé ;
- micarta.

### Personnalisation `/personnalisation`

- Mise en avant de la gravure personnalisée sur la lame.
- Utilisation d'un zoom sur `bois-naturel-veine.jpeg`.
- Appel à l'action vers la demande de contact.

### Savoir-Faire `/savoir-faire`

- Présentation du caractère artisanal.
- Texte à enrichir avec le processus réel de conception, fabrication, assemblage et finition.

### Contact `/contact`

- Page de pré-demande de commande personnalisée.
- L'email de contact officiel est `compta@laboratoire-pitot.com`.
- Le site ne doit pas reposer principalement sur un lien `mailto`.
- Les demandes doivent être enregistrées en base via API.

## Photos Et Assets

Les images publiques sont stockées dans `public/photos`.

Organisation actuelle :

- `public/photos/bois-naturel`
- `public/photos/bois-stabilise`
- `public/photos/micarta`

Les noms de fichiers doivent rester compatibles URL : minuscules, tirets, sans espaces.

## Données Et Base

La base PostgreSQL utilise un schéma dédié `patrick_pitot`.

Les tables créées couvrent :

- matériaux ;
- produits ;
- images produit ;
- demandes de contact ;
- demandes de commande personnalisée ;
- commandes ;
- lignes de commande ;
- futurs utilisateurs admin ;
- journal d'audit admin.

Voir aussi `_docs/data-schema.md`.

## API Prévue

Le site étant déployé sur Netlify, l'API prévue doit rester légère avec Netlify Functions plutôt qu'un backend Python/Heroku.

Routes envisagées :

- `GET /api/products`
- `POST /api/contact`
- `POST /api/custom-order`
- `POST /api/order`
- `POST /api/admin/magic-link/request`
- `GET /api/admin/magic-link/verify`
- `GET /api/admin/orders`
- `GET /api/admin/contacts`
- `PATCH /api/admin/orders/:id`

La connexion à PostgreSQL doit se faire côté fonction Netlify uniquement, via variable d'environnement `DATABASE_URL`. Les identifiants DB ne doivent jamais être exposés dans React.

## Administration

Objectif : donner un accès d'administration à Patrick pour gérer les demandes et commandes.

Authentification souhaitée :

- accès par lien magique ;
- uniquement pour les utilisateurs présents dans `admin_user` ;
- token à usage unique ;
- expiration courte ;
- session admin via cookie sécurisé.

Tables complémentaires à prévoir :

- `admin_magic_link`
- `admin_session`

## Fonctionnalités eCommerce À Prévoir

- Catalogue connecté à la base.
- Gestion de disponibilité ou stock.
- Formulaire de demande produit.
- Formulaire de commande personnalisée.
- Interface d'administration.
- Suivi des statuts de demandes et commandes.
- Pages légales : mentions légales, CGV, politique de confidentialité.
- Paiement sécurisé à décider ultérieurement.

## Contenus À Collecter

- Biographie courte de Patrick Pitot.
- Texte de présentation de l'atelier.
- Photos haute qualité des couteaux.
- Photos de l'atelier et du processus de fabrication.
- Dimensions et caractéristiques des couteaux.
- Prix et conditions de vente.
- Zones et modes de livraison.
- Informations légales de l'entreprise.
- Réseaux sociaux éventuels.

## Notes Ouvertes

- Déterminer si les couteaux seront vendus directement en ligne ou traités comme demandes de réservation.
- Déterminer si les pièces vendues doivent rester visibles comme galerie de réalisations.
- Choisir le canal d'envoi des liens magiques : email SMTP, Brevo, Resend, Mailgun ou autre.
- Choisir une solution de paiement si la vente directe est activée.
- Brancher les formulaires React sur les Netlify Functions.
