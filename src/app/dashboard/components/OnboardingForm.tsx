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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  full_name: z.string().min(3, {
    message: 'Le nom complet doit contenir au moins 3 caractères.',
  }),
  role: z.enum(['client', 'freelance'], { error: 'Veuillez sélectionner un rôle.' }),
  whatsapp_number: z.string().optional(),
}).refine((data) => {
  if (data.role === 'freelance' && (!data.whatsapp_number || data.whatsapp_number.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Le numéro WhatsApp est obligatoire pour les freelances.',
  path: ['whatsapp_number'],
});

export default function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      role: 'client',
      whatsapp_number: '',
    },
  });

  const selectedRole = form.watch('role');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié.');

      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          role: values.role,
          status: values.role === 'client' ? 'valide' : 'en_attente',
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. If freelance, upsert into freelance_contacts
      if (values.role === 'freelance') {
        const { error: contactError } = await supabase
          .from('freelance_contacts')
          .upsert({
            id: user.id,
            whatsapp_number: values.whatsapp_number,
          });

        if (contactError) throw contactError;
      }

      form.reset();
      setIsLoading(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour.';
      setError(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Votre rôle</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="client">Client (Je cherche un freelance)</SelectItem>
                    <SelectItem value="freelance">Freelance (Je propose mes services)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez votre rôle principal sur la plateforme.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedRole === 'freelance' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro WhatsApp (Obligatoire pour les freelances)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+241 00 00 00 00" 
                        type="tel"
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Les clients vous contacteront via ce numéro.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour en cours...
              </>
            ) : (
              'Finaliser mon profil'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
