import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: '404 – Page introuvable | GabWork' };

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <p className="text-8xl font-black tracking-tighter text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page introuvable.</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        On dirait que cette page est partie en pause... Le lien est peut-être cassé ou le talent a changé d'adresse.
      </p>
      <Button asChild size="lg" className="font-bold">
        <Link href="/freelances">Retour au catalogue</Link>
      </Button>
    </div>
  );
}
