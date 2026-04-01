'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

const profileSchema = z.object({
  whatsapp_number: z.string().min(1, { message: 'Le numéro WhatsApp est obligatoire.' }),
  portfolio_url: z.string()
    .url({ message: "Veuillez entrer une URL valide (ex: https://...)" })
    .optional()
    .or(z.literal('')),
  category: z.enum(['Developpement', 'Design', 'Marketing', 'Redaction', 'Multimedia', 'Assistance', 'Comptabilite', 'Autre']).optional(),
  custom_category: z.string().optional(),
  hourly_rate: z.coerce.number().positive().optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
});

export default function ProfileClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      whatsapp_number: '',
      portfolio_url: '',
      category: undefined,
      custom_category: '',
      hourly_rate: '' as unknown as number,
      bio: '',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);

        const [{ data: contactData, error: contactError }, { data: profileData, error: profileError }] = await Promise.all([
          supabase.from('freelance_contacts').select('whatsapp_number, portfolio_url').eq('id', user.id).single(),
          supabase.from('profiles').select('category, custom_category, hourly_rate, bio, role, avatar_url, banner_url').eq('id', user.id).single(),
        ]);

        if (contactError && contactError.code !== 'PGRST116') {
          console.error('Erreur contact:', contactError);
        }
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Erreur profil:', profileError);
        }

        // Redirection si pas freelance
        if (profileData?.role !== 'freelance') {
          setIsFetching(false);
          router.push('/dashboard');
          return;
        }

        form.reset({
          whatsapp_number: contactData?.whatsapp_number || '',
          portfolio_url: contactData?.portfolio_url || '',
          category: profileData?.category || undefined,
          custom_category: profileData?.custom_category || '',
          hourly_rate: profileData?.hourly_rate || ('' as unknown as number),
          bio: profileData?.bio || '',
        });
        setAvatarUrl(profileData?.avatar_url || null);
        setBannerUrl(profileData?.banner_url || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, [supabase, router, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié.');

      await Promise.all([
        supabase.from('freelance_contacts').upsert({ id: user.id, whatsapp_number: values.whatsapp_number, portfolio_url: values.portfolio_url || null }),
        supabase.from('profiles').update({
          category: values.category,
          custom_category: values.category === 'Autre' ? values.custom_category : null,
          hourly_rate: values.hourly_rate || null,
          bio: values.bio || null,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
        }).eq('id', user.id),
      ]);

      setSuccess(true);
      setIsLoading(false);
      router.refresh();
      
      // Disparition de l'alerte succès après 4 secondes
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" asChild className="-ml-2 text-muted-foreground hover:text-primary">
        <Link href="/dashboard">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profil Public</h1>
        <p className="text-muted-foreground">
          Gérez vos informations de contact et votre vitrine portfolio.
        </p>
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Vos contacts professionnels</CardTitle>
          <CardDescription>
            Ces informations ne seront visibles que par les utilisateurs connectés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-900 transition-all">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>Vos informations ont été mises à jour avec succès.</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {!isFetching && (
                    <div className="space-y-6 mb-6">
                      <ImageUpload
                        bucket="avatars"
                        userId={userId || ''}
                        currentUrl={avatarUrl}
                        onUploadComplete={(url) => setAvatarUrl(url)}
                        label="Photo de profil"
                        aspectRatio="square"
                      />
                      <ImageUpload
                        bucket="banners"
                        userId={userId || ''}
                        currentUrl={bannerUrl}
                        onUploadComplete={(url) => setBannerUrl(url)}
                        label="Bannière (image de couverture)"
                        aspectRatio="banner"
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="whatsapp_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro WhatsApp (Obligatoire)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+241 77 00 00 00 ou +33 6 00 00 00 00" 
                            type="tel"
                            disabled={isLoading} 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Entrez votre numéro avec l'indicatif pays (ex: +241, +33, +1...)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="portfolio_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lien Portfolio (optionnel)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.behance.net/monprofil"
                            type="url"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Behance, GitHub, Instagram, Dribbble... Partagez vos meilleures réalisations.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un domaine d'expertise" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Developpement">Développement</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Redaction">Rédaction</SelectItem>
                            <SelectItem value="Multimedia">Multimédia</SelectItem>
                            <SelectItem value="Assistance">Assistance</SelectItem>
                            <SelectItem value="Comptabilite">Comptabilité</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('category') === 'Autre' && (
                    <FormField
                      control={form.control}
                      name="custom_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Précisez votre catégorie</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre domaine..." disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="hourly_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux horaire (XAF)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 5000" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Parlez-nous de vous..." 
                            className="resize-none"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Une courte description de votre profil (max. 500 caractères).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement en cours...
                      </>
                    ) : (
                      'Sauvegarder les modifications'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
