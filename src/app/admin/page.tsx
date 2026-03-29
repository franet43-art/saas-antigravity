import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminActions from './components/AdminActions';

export const revalidate = 0; // Ensures data is fresh

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.is_admin !== true) {
    redirect('/');
  }

  const { data: allProfiles, error } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, role, status, created_at, bio, category')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Administrateur</h1>
          <p className="text-muted-foreground mt-2">Gérez les profils et les validations en attente.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProfiles?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name || 'Non défini'}</TableCell>
                <TableCell className="capitalize">{p.role}</TableCell>
                <TableCell>
                  {p.status === 'active' ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">Actif</Badge>
                  ) : p.status === 'en_attente' ? (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 border-yellow-500/50">En attente</Badge>
                  ) : (
                    <Badge variant="outline" className="capitalize">{p.status}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {p.created_at ? format(new Date(p.created_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <AdminActions profile={p} />
                </TableCell>
              </TableRow>
            ))}
            {(!allProfiles || allProfiles.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun profil trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
