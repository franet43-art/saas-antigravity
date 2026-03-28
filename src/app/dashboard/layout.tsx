import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  Menu,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import LogoutButton from './components/LogoutButton';

const sidebarLinks = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profil', icon: User },
  { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
];

const SidebarContent = () => (
  <div className="flex flex-col h-full py-4 px-3">
    <div className="px-3 py-2">
      <h2 className="text-xl font-bold tracking-tight mb-4 text-primary">
        GabWork
      </h2>
      <div className="space-y-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors group"
          >
            <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
    
    <div className="mt-auto px-3">
      <Separator className="my-4" />
      <LogoutButton />
    </div>
  </div>
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-background lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 shadow-sm lg:px-8">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu de navigation</SheetTitle>
                  </SheetHeader>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <h2 className="ml-3 text-lg font-bold text-primary lg:hidden">
                GabWork
              </h2>
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
