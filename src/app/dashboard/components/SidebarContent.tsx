import Link from 'next/link';
import { LayoutDashboard, User, Settings, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import LogoutButton from './LogoutButton';

const sidebarLinks = [
  { href: '/freelances', label: 'Catalogue', icon: Search },
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profil', icon: User },
  { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
];

export default function SidebarContent({ role }: { role?: string }) {
  const filteredLinks = sidebarLinks.filter(link => {
    if (role === 'client' && link.href === '/dashboard/profile') {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full py-4 px-3">
      <div className="px-3 py-2">
        <Link href="/" className="block">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-primary hover:opacity-80 transition-opacity">
            GabWork
          </h2>
        </Link>
        <div className="space-y-1">
          {filteredLinks.map((link) => (
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
}
