import { createClient } from '@/utils/supabase/server';
import ProfileEditForm from './components/ProfileEditForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Mon Profil Public</h1>
      
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileEditForm initialData={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
