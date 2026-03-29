'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Eye, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  status: string;
  bio?: string;
  category?: string;
  created_at: string;
}

export default function AdminActions({ profile }: { profile: Profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', profile.id);

      if (error) {
        throw new Error(error.message);
      }

      setIsOpen(false);
      router.refresh(); // Rafraîchit les données Server Component
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erreur lors de la mise à jour du statut:", err.message);
        alert(`Erreur: ${err.message}`);
      } else {
        console.error("Une erreur inconnue est survenue", err);
        alert("Une erreur inconnue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le profil</span>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du profil</DialogTitle>
          <DialogDescription>
            Informations sur {profile.full_name || 'Utilisateur anonyme'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium text-sm">Nom</span>
            <span className="col-span-3 text-sm">{profile.full_name || 'Non renseigné'}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium text-sm">Catégorie</span>
            <span className="col-span-3 text-sm">
              {profile.category ? (
                <Badge variant="outline">{profile.category}</Badge>
              ) : (
                <span className="text-muted-foreground">Non renseigné</span>
              )}
            </span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-medium text-sm pt-1">Bio</span>
            <span className="col-span-3 text-sm rounded-md bg-muted p-3 whitespace-pre-wrap min-h-[60px]">
              {profile.bio || 'Aucune biographie disponible.'}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium text-sm">Statut</span>
            <span className="col-span-3 text-sm font-semibold capitalize">
              {profile.status}
            </span>
          </div>
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          {profile.status === 'en_attente' && (
            <Button
              type="button"
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusUpdate('active')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Activer le profil
            </Button>
          )}
          {profile.status === 'active' && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleStatusUpdate('en_attente')}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Suspendre le profil
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
