# Administration Patrick Pitot

L'administration doit permettre a Patrick de gerer les demandes, les commandes, le catalogue et les certificats NFC.

## Acces

L'acces admin cible est un lien magique :

- seuls les utilisateurs presents dans `admin_user` peuvent se connecter ;
- le lien est a usage unique ;
- l'expiration doit etre courte ;
- une session admin est ensuite stockee via cookie securise ;
- les actions importantes doivent etre tracees dans `admin_audit_log`.

Tables complementaires a prevoir :

- `admin_magic_link`
- `admin_session`

## Gestion des demandes

Fonctionnalites attendues :

- consulter les demandes de contact ;
- consulter les demandes sur mesure ;
- consulter les intentions de commande ;
- changer les statuts ;
- ajouter des notes internes ;
- retrouver les coordonnees client ;
- preparer une reponse ou un devis.

## Gestion des certificats NFC

Fonctionnalites attendues :

- creer un certificat pour un couteau ;
- rattacher le certificat a un produit existant, une commande ou une commande personnalisee ;
- renseigner le numero de serie ;
- renseigner la matiere, la description, les photos et la gravure ;
- definir les conseils d'entretien ;
- generer l'URL publique du certificat ;
- afficher l'URL et un QR code pour faciliter la programmation de la puce NFC ;
- activer le certificat quand la piece est livree ;
- desactiver, revoquer ou marquer perdu un certificat ;
- consulter le nombre de scans et la date de premiere consultation.

## Cycle de vie conseille

1. Patrick cree ou selectionne un produit ou une commande.
2. Patrick cree un certificat en statut `draft`.
3. Le systeme genere un `public_id` aleatoire.
4. L'admin affiche l'URL publique a programmer dans la puce NFC.
5. La puce est testee avant livraison.
6. Le certificat passe en statut `active`.
7. Le client scanne la puce et consulte la page `/certificat/:publicId`.
