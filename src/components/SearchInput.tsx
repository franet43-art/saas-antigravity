'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTransition } from 'react';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative max-w-xl mx-auto pt-6">
      <Search className={`absolute left-3 top-[calc(50%+12px)] -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none ${isPending ? 'opacity-50' : ''}`} />
      <Input 
        placeholder="Rechercher par métier ou compétence..." 
        className="pl-10 h-12 shadow-sm rounded-full border-primary/20 bg-primary/5 focus-visible:ring-primary"
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
