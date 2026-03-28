import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import OnboardingForm from './components/OnboardingForm';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const hasCompletedProfile = profile?.full_name && profile.full_name.trim() !== '';
  const isFreelancePending = profile?.role === 'freelance' && profile?.status === 'en_attente';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            {hasCompletedProfile 
              ? `Heureux de vous revoir, ${profile.full_name} !` 
              : "Bienvenue sur GabWork !"}
          </p>
        </div>
      </div>

      {isFreelancePending && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 shadow-sm">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between w-full">
            <span>
              <strong>Attention :</strong> Votre profil n&apos;est pas visible par les clients. 
              Complétez vos informations métier pour apparaître dans le catalogue.
            </span>
            <Link 
              href="/dashboard/profile" 
              className="text-amber-700 underline underline-offset-4 hover:text-amber-800 font-medium ml-4 transition-colors"
            >
              Compléter mon profil
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {!hasCompletedProfile ? (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Finalisez votre inscription</CardTitle>
            <CardDescription>
              Il semble que vous n'ayez pas encore complété vos informations de base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Rôle</span>
                <Badge variant="outline" className="capitalize">
                  {profile.role || 'Non défini'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Statut</span>
                <Badge className={profile.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                  {profile.status || 'En attente'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
