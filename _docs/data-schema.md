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

## Principe

Le site ne doit pas utiliser l'email comme canal principal pour les contacts ou commandes.
Les formulaires devront enregistrer les demandes en base, puis l'administration permettra
a Patrick de suivre, qualifier et traiter ces demandes.

## Migration

La migration initiale est dans `db/migrations/001_patrick_pitot_schema.sql`.
Elle peut etre rejouee de maniere idempotente avec :

```bash
python scripts/apply-db-migration.py db/migrations/001_patrick_pitot_schema.sql --env ../pitsbi-gears/backend/.env
```
