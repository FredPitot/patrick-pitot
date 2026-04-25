# API Netlify Functions

Le site Patrick Pitot est deploye sur Netlify. L'API doit rester legere et etre implementee via Netlify Functions dans ce meme depot.

La connexion PostgreSQL se fait uniquement cote fonction, via `DATABASE_URL` configure dans les variables d'environnement Netlify. React ne doit jamais contenir d'identifiants de base de donnees.

## Routes publiques

### `GET /api/products`

Retourne les produits publics du catalogue.

### `POST /api/contact`

Enregistre une demande de contact dans `contact_request`.

### `POST /api/custom-order`

Enregistre une demande de couteau sur mesure dans `custom_order_request`.

### `POST /api/order`

Enregistre une intention de commande dans `order_request` et `order_request_item`.

### `GET /api/certificates/:publicId`

Retourne les informations publiques d'un certificat d'authenticite.

Comportement attendu :

- rechercher le certificat par `public_id` ;
- ne retourner que les champs publics ;
- incrementer optionnellement `scan_count` ;
- renseigner `first_viewed_at` si c'est la premiere consultation ;
- retourner un statut clair si le certificat est `revoked`, `lost`, `draft` ou introuvable.

Le `publicId` doit etre non devinable et ne doit pas etre l'identifiant interne de la table.

## Routes admin

Toutes les routes admin doivent verifier une session admin valide.

### Authentification

- `POST /api/admin/magic-link/request`
- `GET /api/admin/magic-link/verify`

### Demandes et commandes

- `GET /api/admin/orders`
- `GET /api/admin/contacts`
- `PATCH /api/admin/orders/:id`

### Certificats NFC

- `POST /api/admin/certificates`
- `PATCH /api/admin/certificates/:id`
- `POST /api/admin/certificates/:id/register-scan`
- `POST /api/admin/certificates/:id/link-product`

Ces routes permettent de creer un certificat, modifier ses informations, changer son statut, rattacher une piece a un produit ou une commande, et preparer l'URL a programmer dans une puce NFC.
