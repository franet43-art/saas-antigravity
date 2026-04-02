'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().trim().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  password: z.string().min(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  }),
});

export default function SignupForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const supabase = useMemo(() => createClient(), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const rawRedirect = searchParams.get('redirectTo') || '/dashboard';
      const redirectTo = rawRedirect.startsWith('/') ? rawRedirect : '/dashboard';

      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      setSubmittedEmail(values.email);
      setSuccess(true);
      form.reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Vérifiez votre boîte mail</CardTitle>
          <CardDescription className="text-base">
            Un email de confirmation a été envoyé à
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="font-semibold text-primary text-lg">{submittedEmail}</p>
          <p className="text-sm text-muted-foreground">
            Cliquez sur le lien de confirmation dans l&apos;email pour activer votre compte.
          </p>
          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>💡 Si vous ne voyez pas l&apos;email, vérifiez votre dossier <strong>spam</strong> ou <strong>courrier indésirable</strong>.</p>
          </div>
          <div className="pt-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-primary">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
        <CardDescription className="text-center">
          Entrez vos informations pour vous inscrire sur GabWork
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="nom@exemple.com"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      className="focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-semibold transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}