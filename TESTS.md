# Matrice de validation — Constat V2

## Parcours d’entrée

- Création depuis un téléphone, reprise après fermeture et enregistrement manuel.
- Adresse, parties, compteurs et moyens d’accès incomplets.
- Pièce entièrement conforme avec action rapide.
- Défaut localisé avec description et photographie légendée.
- Élément neuf, état d’usage, mauvais état, à remplacer et non concerné.
- Ajout, duplication et suppression d’une pièce ou d’un élément.
- Validation refusée lorsqu’un élément reste « Non vérifié ».
- Signature manquante, accord non coché et dossier complet.

## Parcours de sortie

- Choix obligatoire d’un état des lieux d’entrée existant.
- Création exceptionnelle d’une sortie sans entrée.
- Conservation immuable de la référence, de l’état et de la description d’entrée.
- Réinitialisation des photos, validations, observations et signatures.
- État identique, amélioration, usure et dégradation.
- Modification de la sortie sans modification de l’entrée d’origine.
- Suppression ultérieure de l’entrée sans perte de la référence figée dans la sortie.

## Données et sécurité d’usage

- Stockage IndexedDB adapté aux dossiers contenant des photos.
- Migration initiale des anciens dossiers enregistrés dans le navigateur.
- Enregistrement automatique, manuel et lors du passage en arrière-plan.
- Message explicite en cas d’échec du stockage.
- Export et réimportation de la sauvegarde globale.
- Fonctionnement hors ligne après le premier chargement.

## Document final

- Couverture et référence du dossier.
- Synthèse du bien et des parties.
- Référence d’entrée affichée pour une sortie liée.
- Comparaison entrée/sortie par élément.
- Mise en évidence des dégradations et points d’attention.
- Photographies avec numérotation et légendes.
- Compteurs, clés, observations, réserves et signatures.
- Répétition des en-têtes de tableau lors des changements de page.

## Contrôles automatisés

- Syntaxe des scripts principal et V2.
- Huit invariants de filiation entrée → sortie : identifiants distincts, lien source, référence figée, état initial conservé, état de sortie réinitialisé, description initiale conservée, photos réinitialisées et entrée source non modifiée.
