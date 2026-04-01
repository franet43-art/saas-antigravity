import { User } from 'lucide-react';
import Link from 'next/link';

interface FreelanceCardProps {
  id: string;
  full_name: string | null;
  category: string | null;
  custom_category: string | null;
  hourly_rate: number | null;
  bio: string | null; // Conservé pour la prop interface
  avatar_url: string | null;
}

export default function FreelanceCard({
  id,
  full_name,
  category,
  custom_category,
  hourly_rate,
  avatar_url,
}: FreelanceCardProps) {
  const displayCategory = category === 'Autre' && custom_category ? custom_category : category;

  return (
    <div className="p-4 flex flex-col items-center text-center rounded-xl bg-card border hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all h-full">
      {/* 1. Avatar placeholder */}
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center shrink-0 mb-3 overflow-hidden">
        {avatar_url ? (
          <img src={avatar_url} alt={full_name || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <User className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      {/* 2. Nom */}
      <h3 className="font-bold text-sm leading-tight text-foreground mb-1 line-clamp-1">
        {full_name || 'Anonyme'}
      </h3>

      {/* 3. Badge catégorie */}
      <span className="bg-secondary text-secondary-foreground text-[10px] font-medium uppercase tracking-widest rounded-full px-2 py-0.5 mb-auto line-clamp-1">
        {displayCategory || 'Secteur non défini'}
      </span>

      {/* 4. Tarif */}
      <div className="text-xs font-semibold mt-4 mb-3">
        {hourly_rate ? `${hourly_rate.toLocaleString()} FCFA/h` : 'Sur devis'}
      </div>

      {/* 5. Bouton "Voir Profil" */}
      <Link 
        href={`/freelances/${id}`}
        className="block w-full py-2 rounded-full text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Voir Profil
      </Link>
    </div>
  );
}
