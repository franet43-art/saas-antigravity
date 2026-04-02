import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import FreelanceCard from '@/components/FreelanceCard';
import SearchInput from '@/components/SearchInput';
import CategoryFilter from './components/CategoryFilter';

export default async function CataloguePage(props: { searchParams?: Promise<{ q?: string, category?: string }> }) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;
  const q = searchParams?.q || '';
  const category = searchParams?.category || '';

  // Security Max: No .select('*'), strictly defined fields
  // Filters: Role must be 'freelance' and status must be 'valide'/'active'
  let query = supabase
    .from('profiles')
    .select('id, full_name, category, custom_category, hourly_rate, bio, avatar_url')
    .eq('role', 'freelance')
    .eq('status', 'valide');

  if (category) {
    query = query.eq('category', category);
  }

  if (q) {
    query = query.or(`custom_category.ilike.%${q}%,full_name.ilike.%${q}%`);
  }

  const { data: freelances, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error:', JSON.stringify(error, null, 2));
  }

  return (
    <main className="container mx-auto py-12 px-4 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight mx-auto text-gray-900">
          Trouvez l&apos;expertise <span className="text-primary">Gabonaise</span> idéale
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez les meilleurs freelances locaux vérifiés pour vos projets. Qualité, proximité et confiance.
        </p>
        
        <div className="flex flex-col gap-4 mt-6 max-w-xl mx-auto w-full">
          <div className="w-full">
            <Suspense fallback={<div className="h-14 w-full animate-pulse bg-muted rounded-md" />}>
              <SearchInput />
            </Suspense>
          </div>
          <div className="w-full">
            <Suspense fallback={<div className="h-14 w-full animate-pulse bg-muted rounded-md" />}>
              <CategoryFilter />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {freelances?.map((freelance, index) => (
          <FreelanceCard 
            key={freelance.id}
            id={freelance.id}
            full_name={freelance.full_name}
            category={freelance.category}
            custom_category={freelance.custom_category}
            hourly_rate={freelance.hourly_rate}
            bio={freelance.bio}
            avatar_url={freelance.avatar_url}
            index={index}
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
