import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/app/dashboard/components/LogoutButton';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background shadow-sm overflow-x-hidden">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tighter">
            Gab<span className="text-primary">Work</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/freelances" className="transition-colors hover:text-primary">
            Catalogue
          </Link>
        </div>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">S&apos;inscrire</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild size="sm" className="hidden md:flex">
                <Link href="/dashboard">Mon Dashboard</Link>
              </Button>
              <div className="hidden md:flex">
                <LogoutButton />
              </div>
              <Button variant="ghost" asChild size="sm" className="flex md:hidden">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
