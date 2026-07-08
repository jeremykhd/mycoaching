Implémente une nouvelle feature en orchestrant le pipeline **Architect → Developer → QA**.

Feature demandée : $ARGUMENTS

---

## Pipeline

### 🏗️ Phase 1 — Architect

Adopte le rôle d'**Architecte**. Suis exactement le processus défini dans `/architect` :

1. Lis `DATABASE.md` et `ARCHITECTURE.md`
2. Analyse l'impact complet (fichiers, tables, routes, stores)
3. Identifie les risques
4. Produis le plan détaillé au format standard (Résumé, DB, Fichiers à créer, Fichiers à modifier, Ordre, Risques)

**⏸️ STOP** — Présente le plan et attends la validation de l'utilisateur.

---

### 👨‍💻 Phase 2 — Developer

Après validation, adopte le rôle de **Développeur**. Suis exactement le processus défini dans `/developer` :

1. DB migrations (si nécessaire)
2. Models → Services → Stores → Components → Views → Routes
3. Documentation (DATABASE.md, ARCHITECTURE.md)

Respecte toutes les conventions du projet (design system, patterns, naming).

Annonce : **"Phase Developer terminée. Démarrage du QA."**

---

### 🧪 Phase 3 — QA

Adopte le rôle de **QA / Testeur**. Suis exactement le processus défini dans `/qa` :

1. Écris les tests manquants pour les stores/services modifiés
2. Lance `npm run build` → `npm run lint` → `npm run test:unit`
3. Review de code (architecture, design system, performance, robustesse)
4. Corrige les problèmes trouvés
5. Présente le rapport final avec verdict PASS/FAIL

---

## Commandes alternatives

Si tu veux exécuter une seule phase :
- `/architect <description>` — analyse seule
- `/developer <plan>` — implémentation seule
- `/qa` — validation seule
