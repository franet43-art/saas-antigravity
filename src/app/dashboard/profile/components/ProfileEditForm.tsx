'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
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
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  bio: z.string().min(10, {
    message: 'Votre biographie doit contenir au moins 10 caractères.',
  }),
  category: z.string({
    error: 'Veuillez sélectionner une catégorie.',
  }),
  custom_category: z.string().optional(),
  hourly_rate: z.coerce.number().min(0, {
    message: 'Le tarif horaire doit être un nombre positif.',
  }),
}).refine((data) => {
  if (data.category === 'Autre' && (!data.custom_category || data.custom_category.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Veuillez spécifier votre catégorie.',
  path: ['custom_category'],
});

interface ProfileEditFormProps {
  initialData?: {
    bio?: string | null;
    category?: string | null;
    custom_category?: string | null;
    hourly_rate?: number | null;
  };
}

export default function ProfileEditForm({ initialData }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: initialData?.bio || '',
      category: initialData?.category || '',
      custom_category: initialData?.custom_category || '',
      hourly_rate: initialData?.hourly_rate || 0,
    },
  });

  const selectedCategory = form.watch('category');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié.');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio: values.bio,
          category: values.category,
          custom_category: values.category === 'Autre' ? values.custom_category : null,
          hourly_rate: values.hourly_rate,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="font-medium">
            Profil mis à jour avec succès !
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biographie professionnelle</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Présentez votre expertise et vos expériences..." 
                    className="min-h-[120px] resize-none"
                    disabled={isLoading} 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Décrivez ce que vous faites en quelques phrases pour attirer les clients.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d'activité</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Developpement">Développement web/mobile</SelectItem>
                      <SelectItem value="Design">Design & Graphisme</SelectItem>
                      <SelectItem value="Marketing">Marketing & Réseaux sociaux</SelectItem>
                      <SelectItem value="Redaction">Rédaction & Traduction</SelectItem>
                      <SelectItem value="Multimedia">Vidéo & Photo</SelectItem>
                      <SelectItem value="Assistance">Assistance virtuelle</SelectItem>
                      <SelectItem value="Comptabilite">Comptabilité & Finance</SelectItem>
                      <SelectItem value="Autre">Autre (spécifier)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif horaire (FCFA)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="5000" 
                      disabled={isLoading} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Votre tarif moyen par heure de travail.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {selectedCategory === 'Autre' && (
            <FormField
              control={form.control}
              name="custom_category"
              render={({ field }) => (
                <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormLabel>Spécifiez votre catégorie</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Coaching, Photographie..." disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
