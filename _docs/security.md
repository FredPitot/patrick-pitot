# Securite

## Principes generaux

- Les identifiants PostgreSQL ne doivent jamais etre exposes dans React.
- Les appels a la base doivent passer par Netlify Functions.
- Les routes admin doivent verifier une session admin valide.
- Les identifiants internes UUID ne doivent pas etre utilises comme identifiants publics quand ce n'est pas necessaire.

## NFC et certificats

La V1 NFC repose sur une puce passive contenant une URL publique unique :

`/certificat/:publicId`

Cette approche fournit un certificat numerique pratique et premium, mais ne constitue pas une authentification cryptographique forte.

## Limites de la NFC simple

- Une puce NFC passive ne transmet une information que lors d'un scan volontaire a courte distance.
- Elle ne permet pas de geolocaliser un couteau.
- Certaines puces simples peuvent etre copiees ou clonees.
- L'UID NFC ne doit jamais etre considere comme un secret fiable.

Le discours commercial doit donc eviter toute promesse de geolocalisation antivol. Pour une geolocalisation reelle, il faudrait une technologie active de type Bluetooth tracker, non retenue pour la V1.

## V1 recommandee

- Generer un `public_id` aleatoire, long et difficile a deviner.
- Programmer l'URL publique dans la puce NFC.
- Verifier le statut du certificat en base.
- Prevoir les statuts `draft`, `active`, `revoked`, `lost`.
- Ne retourner que les donnees publiques sur `GET /api/certificates/:publicId`.
- Enregistrer optionnellement la premiere consultation et un compteur de scans.

## V2 possible

Pour une preuve plus forte, et si le besoin commercial le justifie, etudier des puces avec mecanismes cryptographiques comme NTAG 424 DNA ou equivalent.

Une V2 pourrait ajouter :

- verification cryptographique du scan ;
- signature dynamique ;
- anti-clonage plus robuste ;
- audit plus fin des consultations.

Cette V2 n'est pas requise pour lancer le certificat numerique premium.
