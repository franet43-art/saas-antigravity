# GabWork — Architecture & Règles Projet

## Projet

**GabWork** — Plateforme de mise en relation freelances numériques × clients au Gabon.

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Styling | Tailwind CSS |
| Composants UI | shadcn/ui |
| Backend / BDD | Supabase (PostgreSQL, Auth, Edge Functions, Storage) |

## Règles Absolues

### 1. Zéro chat interne

Aucun système de messagerie intégré. Le contact entre clients et freelances se fait **exclusivement** via un bouton WhatsApp avec message pré-rempli.

### 2. Sécurité WhatsApp (CRITIQUE)

Les liens WhatsApp (`whatsapp_link`) ne doivent **JAMAIS** être exposés côté front-end.

- Les politiques RLS PostgreSQL interdisent la lecture de `whatsapp_link` pour les rôles `anon` et `authenticated`.
- Seule l'API Route sécurisée `/api/get-whatsapp` peut lire cette colonne via le `service_role_key` côté serveur.
- Aucune vue SQL n'est utilisée ; la protection est 100% RLS.

### 3. Modération manuelle

- Chaque nouveau profil freelance démarre avec le statut `en_attente`.
- Un administrateur valide ou rejette manuellement chaque profil.
- Une notification email est envoyée à l'admin à chaque nouveau profil en attente (via Edge Function + pg_net).
- Les profils `en_attente` et `rejete` sont **invisibles** dans toutes les requêtes publiques.

### 4. Design

- **Aucune UI ne doit être codée dans cette phase.**
- Le design viendra ultérieurement via Google Stitch.
- La structure projet est préparée pour accueillir les composants shadcn/ui.

## Structure Base de Données

```
profiles          — Profils freelances (id, user_id, name, category, skills[], whatsapp_link, status, rating…)
portfolio_items   — Portfolio (image / video_link)
reviews           — Avis clients (stars, comment)
reports           — Signalements
```

## API Routes Prévues

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/get-whatsapp` | `GET` | Récupère le lien WhatsApp d'un freelance (serveur uniquement, service_role_key) |

## Conventions

- Fichiers en `kebab-case`
- Composants React en `PascalCase`
- Import alias : `@/*` → `src/*`
- Dossier source : `src/`
