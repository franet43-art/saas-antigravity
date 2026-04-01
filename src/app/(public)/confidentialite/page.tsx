export const metadata = { title: "Politique de Confidentialité | GabWork" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl prose prose-slate">
      <h1 className="text-3xl font-black mb-8">Politique de Confidentialité</h1>
      <p className="text-muted-foreground mb-8">Dernière mise à jour : 31 mars 2026</p>
      <h2 className="text-xl font-bold mt-6 mb-3">1. Collecte des données</h2>
      <p>Dans le cadre de l'utilisation de GabWork, nous collectons les données strictement nécessaires : adresse email, nom complet, rôle, et numéro WhatsApp (exclusivement pour les freelances). Les mots de passe sont chiffrés et sécurisés par Supabase.</p>
      <h2 className="text-xl font-bold mt-6 mb-3">2. Utilisation, Partage et Cookies</h2>
      <p>Le numéro WhatsApp des freelances est protégé par un système d'authentification ("Login Wall") et n'est partagé qu'aux clients inscrits et connectés. GabWork ne revend aucune donnée personnelle à des tiers. Notre site utilise des cookies techniques strictement nécessaires au maintien de votre session et des outils de mesure d'audience anonymisés.</p>
      <h2 className="text-xl font-bold mt-6 mb-3">3. Hébergement et Sécurité</h2>
      <p>Nos bases de données sont sécurisées par Row Level Security (RLS). Pour toute demande de modification ou suppression de vos données, contactez-nous à contact@gabwork.com.</p>
    </div>
  );
}
