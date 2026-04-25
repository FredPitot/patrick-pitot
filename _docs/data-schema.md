# Schema de donnees Patrick Pitot

La base PostgreSQL utilise le schema dedie `patrick_pitot`.

## Tables creees

- `material` : matieres de manche.
- `product` : couteaux presentes ou vendus.
- `product_image` : images rattachees aux couteaux.
- `contact_request` : demandes de contact enregistrees depuis le site.
- `custom_order_request` : demandes de couteau sur mesure.
- `order_request` : commandes ou intentions de commande.
- `order_request_item` : lignes de commande.
- `admin_user` : futurs acces d'administration pour Patrick.
- `admin_audit_log` : historique des actions admin.

## Tables a prevoir pour les certificats NFC

### `knife_certificate`

Table proposee pour representer le certificat numerique d'un couteau.

Champs principaux :

- `id` : identifiant interne UUID, non expose publiquement.
- `public_id` : identifiant public aleatoire, unique et difficile a deviner.
- `serial_number` : numero de serie lisible et affichable au client.
- `product_id` : rattachement optionnel a un produit catalogue.
- `order_request_id` : rattachement optionnel a une commande.
- `custom_order_request_id` : rattachement optionnel a une demande sur mesure.
- `nfc_uid` : UID NFC optionnel, informatif, jamais utilise comme secret unique.
- `status` : `draft`, `active`, `revoked`, `lost`.
- `activated_at` : date d'activation du certificat.
- `first_viewed_at` : premiere consultation publique.
- `scan_count` : compteur optionnel de consultations.
- `made_at` : date de fabrication.
- `handle_material_id` : matiere du manche si differente ou figee pour le certificat.
- `model_name` : nom ou modele affiche sur le certificat.
- `description` : histoire ou description de la piece.
- `engraving_text` : gravure ou personnalisation.
- `care_instructions` : conseils d'entretien.
- `public_notes` : notes publiques complementaires.
- `created_at`, `updated_at`.

### `knife_certificate_image`

Table optionnelle pour rattacher des photos officielles au certificat.

Champs principaux :

- `id`
- `certificate_id`
- `image_url`
- `alt_text`
- `sort_order`
- `is_primary`
- `created_at`

### `knife_certificate_scan`

Table optionnelle pour journaliser les consultations si l'on souhaite conserver un historique detaille.

Champs principaux :

- `id`
- `certificate_id`
- `scanned_at`
- `user_agent`
- `ip_hash`
- `referrer`

Le stockage d'IP doit rester prudent. Preferer un hash ou une conservation minimale si cette donnee n'est pas indispensable.

## Principe

Le site ne doit pas utiliser l'email comme canal principal pour les contacts ou commandes.
Les formulaires devront enregistrer les demandes en base, puis l'administration permettra
a Patrick de suivre, qualifier et traiter ces demandes.

Pour les certificats NFC, le public ne lit que les donnees prevues pour l'affichage public. Les identifiants internes, les notes admin et les donnees sensibles ne doivent jamais etre retournes par l'API publique.

## Migration

La migration initiale est dans `db/migrations/001_patrick_pitot_schema.sql`.
Elle peut etre rejouee de maniere idempotente avec :

```bash
python scripts/apply-db-migration.py db/migrations/001_patrick_pitot_schema.sql --env ../pitsbi-gears/backend/.env
```

Une migration ulterieure devra ajouter les tables NFC ci-dessus.
