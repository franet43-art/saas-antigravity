import { createClient } from '@/utils/supabase/server';
import { User } from 'lucide-react';
import Link from 'next/link';
import SidebarContent from './components/SidebarContent';
import MobileSidebar from './components/MobileSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = undefined;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-background lg:block">
        <SidebarContent role={role} />
      </aside>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 shadow-sm lg:px-8">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center lg:hidden">
              <MobileSidebar role={role} />
              <Link href="/" className="ml-3">
                <h2 className="text-lg font-bold text-primary hover:opacity-80 transition-opacity lg:hidden">
                  GabWork
                </h2>
              </Link>
            </div>
            
            <div className="hidden lg:block">
              <span className="text-sm font-medium text-muted-foreground">
                Bienvenue sur votre espace de travail
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold leading-none">{user?.email?.split('@')[0]}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-4 lg:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
