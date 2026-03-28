import SignupForm from './SignupForm';
import Link from 'next/link';

export const metadata = {
  title: 'Inscription - GabWork',
  description: 'Créez votre compte sur GabWork pour trouver les meilleurs talents au Gabon.',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-linear-to-br from-background to-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            Gab<span className="text-primary">Work</span>
          </Link>
        </div>
        
        <SignupForm />
        
        <p className="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link 
            href="/login" 
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}