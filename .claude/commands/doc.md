Met à jour la documentation du projet après des changements structurels.

Contexte : $ARGUMENTS

---

## Processus

### 1. Identifier les changements récents
- Lance `git diff HEAD` ou `git log --oneline -10` pour comprendre ce qui a changé
- Identifie : nouvelles tables, nouveaux fichiers, nouvelles routes, nouveaux composants

### 2. Mettre à jour DATABASE.md

Si des tables ou colonnes ont été ajoutées/modifiées :
- Ajoute la table dans le format standard (tableau Markdown avec Column, Type, Nullable, Notes)
- Mets à jour le diagramme ER en haut du fichier
- Mets à jour la section "Key Relationships Summary"
- Ajoute les enums si nécessaire

Vérifie la cohérence avec la base réelle via Supabase MCP (`list_tables`) si besoin.

### 3. Mettre à jour ARCHITECTURE.md

Si la structure du projet a changé :
- Mets à jour les tableaux de fichiers dans la section du module concerné
- Mets à jour la table de routing si de nouvelles routes ont été ajoutées
- Mets à jour la liste des stores si un nouveau store a été créé
- Mets à jour les composants shared si de nouveaux ont été ajoutés

### 4. Vérification

- Relis les fichiers mis à jour pour t'assurer de la cohérence
- Vérifie que les chemins de fichiers référencés existent réellement
- Pas de sections dupliquées
- Markdown valide

### 5. Résumé

Liste les changements apportés à chaque fichier de documentation.
