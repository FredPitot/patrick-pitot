# Specs du site Patrick Pitot

## Contexte

Patrick Pitot conçoit et fabrique artisanalement des couteaux. Le site doit servir à la fois de vitrine, de catalogue et de point d'entrée pour les demandes de commande.

Le site est une application React/Vite déployée sur Netlify. Les pages publiques sont servies par React Router, avec une règle Netlify `_redirects` pour permettre le rafraîchissement direct des URLs comme `/boutique`.

## Objectifs

- Présenter l'univers artisanal de Patrick Pitot.
- Mettre en valeur les couteaux fabriqués à la main.
- Montrer les matières disponibles : bois naturel, bois stabilisé, micarta.
- Présenter la personnalisation par gravure sur lame.
- Authentifier certaines pièces via certificat numérique accessible par NFC.
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

### Certificat Produit `/certificat/:publicId`

- Page publique accessible après scan NFC ou via QR code.
- Rôle : afficher la fiche d'authenticité numérique d'un couteau.
- L'URL publique doit utiliser un `publicId` non devinable, sans exposer d'identifiant interne.
- La page doit rester consultable sans compte client.
- Si le certificat est invalide, révoqué ou introuvable, la page doit afficher un message clair sans divulguer de détails sensibles.

Contenu possible :

- statut d'authenticité ;
- numéro de série ;
- nom ou modèle du couteau ;
- matière du manche ;
- date de fabrication ;
- photos officielles ;
- description de la pièce ;
- personnalisation ou gravure éventuelle ;
- conseils d'entretien ;
- lien de contact, SAV ou réaffûtage ;
- lien vers la boutique ou vers une demande de commande similaire.

## NFC Et Authentification Produit

Chaque couteau peut recevoir une puce NFC passive intégrée dans le manche. La puce contient idéalement une URL publique unique du site, par exemple :

`https://couteaux-pitot.netlify.app/certificat/:publicId`

Quand un client scanne le manche avec son téléphone, il arrive sur la page certificat du couteau. Cette fonctionnalité doit être présentée comme :

- un certificat d'authenticité numérique ;
- une traçabilité artisanale ;
- l'histoire de la pièce ;
- une preuve premium pour une pièce unique ;
- un accès pratique aux conseils d'entretien, au SAV ou au réaffûtage.

La NFC ne doit pas être présentée comme une géolocalisation antivol. Elle fonctionne uniquement lors d'un scan volontaire à courte distance. Pour une géolocalisation réelle, il faudrait une technologie active de type Bluetooth tracker, non retenue pour la V1.

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

Tables ou champs complémentaires à prévoir pour la NFC :

- table `knife_certificate` ou `product_certificate` ;
- identifiant public non devinable `public_id` ;
- numéro de série `serial_number` ;
- champ optionnel `nfc_uid` ;
- statut `draft`, `active`, `revoked`, `lost` ;
- date d'activation ;
- date de première consultation ;
- compteur de scans optionnel ;
- rattachement optionnel à `product`, `order_request` ou `custom_order_request`.

Le `nfc_uid` ne doit pas être utilisé seul comme secret de sécurité. Certaines puces NFC simples peuvent être clonées. La preuve publique doit reposer au minimum sur une URL unique avec `publicId` aléatoire, et sur le statut du certificat en base.

Voir aussi `_docs/data-schema.md`.

## API Prévue

Le site étant déployé sur Netlify, l'API prévue doit rester légère avec Netlify Functions plutôt qu'un backend Python/Heroku.

Routes envisagées :

- `GET /api/products`
- `POST /api/contact`
- `POST /api/custom-order`
- `POST /api/order`
- `GET /api/certificates/:publicId`
- `POST /api/admin/magic-link/request`
- `GET /api/admin/magic-link/verify`
- `GET /api/admin/orders`
- `GET /api/admin/contacts`
- `PATCH /api/admin/orders/:id`
- `POST /api/admin/certificates`
- `PATCH /api/admin/certificates/:id`
- `POST /api/admin/certificates/:id/register-scan`
- `POST /api/admin/certificates/:id/link-product`

La connexion à PostgreSQL doit se faire côté fonction Netlify uniquement, via variable d'environnement `DATABASE_URL`. Les identifiants DB ne doivent jamais être exposés dans React.

Voir aussi `_docs/api.md`.

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

Fonctionnalités admin liées aux certificats NFC :

- créer un certificat pour un couteau ;
- rattacher un certificat à un produit existant ou une commande personnalisée ;
- renseigner le numéro de série ;
- renseigner la matière, la description, les photos et la gravure ;
- générer l'URL NFC ;
- afficher un QR code ou une URL à programmer dans la puce NFC ;
- activer, désactiver ou révoquer un certificat ;
- marquer un certificat comme perdu ;
- consulter les scans ou consultations éventuels.

Voir aussi `_docs/admin.md`.

## Sécurité NFC

La V1 peut utiliser une URL unique contenant un `publicId` généré aléatoirement et difficile à deviner. Cette approche est adaptée à un certificat numérique public, mais ne doit pas être décrite comme une authentification cryptographique forte.

Points de sécurité :

- distinguer une NFC simple d'une authentification cryptographique ;
- ne jamais baser toute la preuve d'authenticité sur l'UID NFC seul ;
- ne pas exposer d'identifiants internes dans l'URL publique ;
- prévoir les statuts `revoked` et `lost` si un certificat doit être invalidé ;
- enregistrer optionnellement le premier scan et le nombre de consultations ;
- prévoir une V2 avec puces plus sécurisées, par exemple NTAG 424 DNA ou équivalent, si un niveau de preuve plus fort devient nécessaire.

Voir aussi `_docs/security.md`.

## Fonctionnalités eCommerce À Prévoir

- Catalogue connecté à la base.
- Gestion de disponibilité ou stock.
- Formulaire de demande produit.
- Formulaire de commande personnalisée.
- Interface d'administration.
- Suivi des statuts de demandes et commandes.
- Certificats numériques NFC pour pièces uniques ou séries limitées.
- Pages légales : mentions légales, CGV, politique de confidentialité.
- Paiement sécurisé à décider ultérieurement.

## Contenus À Collecter

- Biographie courte de Patrick Pitot.
- Texte de présentation de l'atelier.
- Photos haute qualité des couteaux.
- Photos de l'atelier et du processus de fabrication.
- Dimensions et caractéristiques des couteaux.
- Numéros de série des pièces certifiées.
- Informations d'authenticité et d'entretien pour les certificats NFC.
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
- Déterminer le type de puce NFC V1 : simple URL publique ou puce cryptographique.
- Définir le format exact des numéros de série.
- Déterminer si tous les couteaux auront un certificat ou seulement les pièces premium.
