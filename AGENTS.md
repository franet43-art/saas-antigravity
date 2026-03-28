# AGENTS.md — GabWork Project Rules

## Stack Technique
- Next.js 16.2.1 App Router UNIQUEMENT — jamais Pages Router
- React 19, Tailwind CSS v4, shadcn/ui, react-hook-form, zod
- Supabase avec @supabase/ssr UNIQUEMENT — jamais auth-helpers-nextjs
- createClient depuis @/utils/supabase/server (Server Components)
- createClient depuis @/utils/supabase/client (Client Components)

## Règles TypeScript ABSOLUES
- JAMAIS catch (err: any) — toujours err: unknown avec instanceof Error
- JAMAIS de props typées any — toujours des interfaces explicites
- JAMAIS de composant défini à l'intérieur d'un autre composant

## Règles React ABSOLUES
- JAMAIS createClient() dans le corps d'un composant — toujours useMemo(() => createClient(), [])
- TOUJOURS setIsLoading(false) avant router.refresh() en cas de succès
- TOUJOURS isLoading géré dans un bloc finally

## Règles Supabase ABSOLUES
- JAMAIS select('*') sur les routes publiques
- La table freelance_contacts (whatsapp_number) ne doit JAMAIS être exposée publiquement
- Le numéro WhatsApp ne doit JAMAIS apparaître dans le HTML si utilisateur non connecté

## Tailwind CSS v4
- Dégradés : bg-linear-to-br (PAS bg-gradient-to-br)

## Architecture des Routes
- src/app/layout.tsx — html/body/font uniquement, pas de Navbar
- src/app/(public)/layout.tsx — contient la Navbar
- src/app/dashboard/ — layout avec Sidebar, jamais de Navbar globale
- src/proxy.ts — gère la protection des routes, pas middleware.ts

## Base de Données
- Table profiles : id, full_name, role, status, bio, category, custom_category, hourly_rate
- Enum job_category : Developpement, Design, Marketing, Redaction, Multimedia, Assistance, Comptabilite, Autre
- Table freelance_contacts : id, whatsapp_number — Zero-Exposure

## Règle d'Or
Ne jamais merger une Pull Request sans validation de l'auditeur technique.
