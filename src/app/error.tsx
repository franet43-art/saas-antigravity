'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <p className="text-8xl font-black tracking-tighter text-destructive mb-4">500</p>
      <h1 className="text-2xl font-bold mb-2">Une erreur est survenue.</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Quelque chose s'est mal passé de notre côté. Notre équipe est sur le coup.
      </p>
      <Button onClick={reset} size="lg" className="font-bold">
        Réessayer
      </Button>
    </div>
  );
}
