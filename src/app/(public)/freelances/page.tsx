import { createClient } from '@/utils/supabase/server';
import FreelanceCard from '@/components/FreelanceCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default async function CataloguePage() {
  const supabase = await createClient();

  // Security Max: No .select('*'), strictly defined fields
  // Filters: Role must be 'freelance' and status must be 'active'
  const { data: freelances, error } = await supabase
    .from('profiles')
    .select('id, full_name, category, custom_category, hourly_rate, bio')
    .eq('role', 'freelance')
    .eq('status', 'active')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching catalogue:', error);
  }

  return (
    <main className="container mx-auto py-12 px-4 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">
          Trouvez l&apos;expertise <span className="text-primary">Gabonaise</span> idéale
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez les meilleurs freelances locaux vérifiés pour vos projets. Qualité, proximité et confiance.
        </p>
        
        <div className="relative max-w-xl mx-auto pt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Rechercher par métier ou compétence..." 
            className="pl-10 h-12 shadow-sm rounded-full border-primary/20 bg-primary/5 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {freelances?.map((freelance) => (
          <FreelanceCard 
            key={freelance.id}
            id={freelance.id}
            full_name={freelance.full_name}
            category={freelance.category}
            custom_category={freelance.custom_category}
            hourly_rate={freelance.hourly_rate}
            bio={freelance.bio}
          />
        ))}

        {(!freelances || freelances.length === 0) && (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted-foreground text-lg">Aucun freelance disponible pour le moment.</p>
          </div>
        )}
      </div>
    </main>
  );
}
