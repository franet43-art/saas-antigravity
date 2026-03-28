'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Déconnexion
    </Button>
  );
}
